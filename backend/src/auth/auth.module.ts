import { Inject, Logger, Module } from "@nestjs/common";
import type {
	DynamicModule,
	MiddlewareConsumer,
	NestModule,
	OnModuleInit,
} from "@nestjs/common";
import {
	DiscoveryModule,
	DiscoveryService,
	HttpAdapterHost,
	MetadataScanner,
} from "@nestjs/core";
import { toNodeHandler } from "better-auth/node";
import { createAuthMiddleware } from "better-auth/plugins";
import type { NextFunction, Request, Response } from "express";
import {
	type ASYNC_OPTIONS_TYPE,
	type AuthModuleOptions,
	ConfigurableModuleClass,
	MODULE_OPTIONS_TOKEN,
	type OPTIONS_TYPE,
} from "@/auth/auth.module-definition";
import { AuthService } from "@/auth/services/auth.service";
import { SkipBodyParsingMiddleware } from "@/auth/middleware/skip-body-parsing.middleware";
import { AFTER_HOOK_KEY, BEFORE_HOOK_KEY, HOOK_KEY } from "@/auth/constants/auth.constants";
import { AuthGuard } from "@/auth/guards/auth.guard";
import { APP_GUARD } from "@nestjs/core";
import { getAuthInstance } from "@/auth/utilities/auth.utilities";
import { ConfigService } from "@nestjs/config";
import { InstallerModule } from "@/modules/installer/installer.module";
import { InstallerService } from "@/modules/installer/services/installer.service";
import { NotInstalledException } from "@/modules/installer/exceptions/not-installed.exception";

const HOOKS = [
	{ metadataKey: BEFORE_HOOK_KEY, hookType: "before" as const },
	{ metadataKey: AFTER_HOOK_KEY, hookType: "after" as const },
];

// biome-ignore lint/suspicious/noExplicitAny: i don't want to cause issues/breaking changes between different ways of setting up better-auth and even versions
export type Auth = any;

/**
 * NestJS module that integrates the Auth library with NestJS applications.
 * Provides authentication middleware, hooks, and exception handling.
 */
@Module({
	imports: [DiscoveryModule, InstallerModule],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule
	extends ConfigurableModuleClass
	implements NestModule, OnModuleInit
{
	private readonly logger = new Logger(AuthModule.name);
	constructor(
		@Inject(ConfigService)
		private readonly configService: ConfigService,
		@Inject(DiscoveryService)
		private readonly discoveryService: DiscoveryService,
		@Inject(MetadataScanner)
		private readonly metadataScanner: MetadataScanner,
		@Inject(HttpAdapterHost)
		private readonly adapter: HttpAdapterHost,
		@Inject(MODULE_OPTIONS_TOKEN)
		private readonly options: AuthModuleOptions,
		@Inject(InstallerService)
		private readonly installerService: InstallerService,
	) {
		super();
	}

	onModuleInit(): void {
		const providers = this.discoveryService
			.getProviders()
			.filter(
				({ metatype }) => metatype && Reflect.getMetadata(HOOK_KEY, metatype),
			);

		const auth = getAuthInstance(this.options.auth);
		const hasHookProviders = providers.length > 0;
		const hooksConfigured =
			typeof auth?.options?.hooks === "object";

		if (hasHookProviders && !hooksConfigured)
			throw new Error(
				"Detected @Hook providers but Better Auth 'hooks' are not configured. Add 'hooks: {}' to your betterAuth(...) options.",
			);

		if (!hooksConfigured) return;

		for (const provider of providers) {
			const providerPrototype = Object.getPrototypeOf(provider.instance);
			const methods = this.metadataScanner.getAllMethodNames(providerPrototype);

			for (const method of methods) {
				const providerMethod = providerPrototype[method];
				this.setupHooks(providerMethod, provider.instance);
			}
		}
	}

	configure(consumer: MiddlewareConsumer): void {
		if (this.options?.disableControllers) return;

		if (!this.options.disableTrustedOriginsCors) {
			const auth = getAuthInstance(this.options.auth);
			
			this.adapter.httpAdapter.enableCors({
				origin: (origin, callback) => {
					const trustedOrigins = [
						`http://${this.configService.get('app.domain')}:3001`
					];
					callback(null, trustedOrigins);
				},
				methods: ["GET", "POST", "PUT", "DELETE"],
				credentials: true,
			});
		}

		// Get basePath from options or use default
		let basePath = getAuthInstance(this.options.auth).options.basePath ?? "/api/auth";

		// Ensure basePath starts with /
		if (!basePath.startsWith("/")) {
			basePath = `/${basePath}`;
		}

		// Ensure basePath doesn't end with /
		if (basePath.endsWith("/")) {
			basePath = basePath.slice(0, -1);
		}

		if (!this.options.disableBodyParser) {
			consumer.apply(SkipBodyParsingMiddleware(basePath)).forRoutes("*path");
		}

		this.adapter.httpAdapter
			.getInstance()
			.use(`${basePath}`, async (req: Request, res: Response, next: NextFunction) => {
				const status = await this.installerService.getInstaller();
				if (!status.installed) {
					throw new NotInstalledException();
				}
				next();
			})
			.use(`${basePath}/*path`, async (req: Request, res: Response, next) => {
				const handler = toNodeHandler(getAuthInstance(this.options.auth));
				if (this.options.middleware) {
					return this.options.middleware(req, res, () => handler(req, res));
				}
				return handler(req, res);
			});
		this.logger.log(`AuthModule initialized BetterAuth on '${basePath}/*'`);
	}

	private setupHooks(
		providerMethod: (...args: unknown[]) => unknown,
		providerClass: { new (...args: unknown[]): unknown },
	) {
		const auth = getAuthInstance(this.options.auth);
		if (!auth.options.hooks) return;

		for (const { metadataKey, hookType } of HOOKS) {
			const hasHook = Reflect.hasMetadata(metadataKey, providerMethod);
			if (!hasHook) continue;

			const hookPath = Reflect.getMetadata(metadataKey, providerMethod);

			const originalHook = auth.options.hooks[hookType];
			auth.options.hooks[hookType] = createAuthMiddleware(
				async (ctx) => {
					if (originalHook) {
						await originalHook(ctx);
					}

					if (hookPath && hookPath !== ctx.path) return;

					await providerMethod.apply(providerClass, [ctx]);
				},
			);
		}
	}

	static forRootAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
		const forRootAsyncResult = super.forRootAsync(options);

		return {
			...forRootAsyncResult,
			controllers: options.disableControllers
				? []
				: forRootAsyncResult.controllers,
			providers: [
				...(forRootAsyncResult.providers ?? []),
				...(!options.disableGlobalAuthGuard
					? [
							{
								provide: APP_GUARD,
								useClass: AuthGuard,
							},
						]
					: []),
			],
		};
	}

	static forRoot(options: typeof OPTIONS_TYPE): DynamicModule;
	/**
	 * @deprecated Use the object-based signature: AuthModule.forRoot({ auth, ...options })
	 */
	static forRoot(
		auth: Auth,
		options?: Omit<typeof OPTIONS_TYPE, "auth">,
	): DynamicModule;
	static forRoot(
		arg1: Auth | typeof OPTIONS_TYPE,
		arg2?: Omit<typeof OPTIONS_TYPE, "auth">,
	): DynamicModule {
		const normalizedOptions: typeof OPTIONS_TYPE =
			typeof arg1 === "object" && arg1 !== null && "auth" in (arg1 as object)
				? (arg1 as typeof OPTIONS_TYPE)
				: ({ ...(arg2 ?? {}), auth: arg1 as Auth } as typeof OPTIONS_TYPE);

		const forRootResult = super.forRoot(normalizedOptions);

		return {
			...forRootResult,
			controllers: normalizedOptions.disableControllers
				? []
				: forRootResult.controllers,
			providers: [
				...(forRootResult.providers ?? []),
				...(!normalizedOptions.disableGlobalAuthGuard
					? [
							{
								provide: APP_GUARD,
								useClass: AuthGuard,
							},
						]
					: []),
			],
		};
	}
}