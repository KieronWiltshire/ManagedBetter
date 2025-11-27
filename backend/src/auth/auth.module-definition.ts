import { ConfigurableModuleBuilder } from "@nestjs/common";
import type { Auth } from "@/auth/auth.module.ts";
import type { Request, Response, NextFunction } from "express";
import { AuthProvider } from "./interfaces/auth-provider.interface";

export type AuthModuleOptions<A = Auth> = {
	/**
	 * Better Auth provider that provides the auth instance, or a direct Auth instance
	 * If an AuthProvider interface is provided, it must implement the instance() method
	 * If a direct Auth instance is provided, it will be used directly
	 */
	auth: AuthProvider<A> | A;
	disableTrustedOriginsCors?: boolean;
	disableBodyParser?: boolean;
	disableGlobalAuthGuard?: boolean;
	disableControllers?: boolean;
	middleware?: (req: Request, res: Response, next: NextFunction) => void;
};

export const MODULE_OPTIONS_TOKEN = Symbol("AUTH_MODULE_OPTIONS");

export const { ConfigurableModuleClass, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE } =
	new ConfigurableModuleBuilder<AuthModuleOptions>({
		optionsInjectionToken: MODULE_OPTIONS_TOKEN,
	})
		.setClassMethodName("forRoot")
		.setExtras(
			{
				isGlobal: true,
				disableTrustedOriginsCors: false,
				disableBodyParser: false,
				disableGlobalAuthGuard: false,
				disableControllers: false,
			},
			(def, extras) => {
				// Merge extras into the options provider
				const optionsProvider = def.providers?.find(
					(p) =>
						typeof p === "object" &&
						"provide" in p &&
						p.provide === MODULE_OPTIONS_TOKEN,
				);

				if (
					optionsProvider &&
					typeof optionsProvider !== "function" &&
					"useValue" in optionsProvider
				) {
					optionsProvider.useValue = {
						...optionsProvider.useValue,
						...extras,
					};
				} else if (
					optionsProvider &&
					typeof optionsProvider !== "function" &&
					"useFactory" in optionsProvider
				) {
					const originalFactory = optionsProvider.useFactory;
					optionsProvider.useFactory = (...args: unknown[]) => {
						const result =
							typeof originalFactory === "function"
								? originalFactory(...args)
								: originalFactory;
						return {
							...result,
							...extras,
						};
					};
				}

				return {
					...def,
					exports: [MODULE_OPTIONS_TOKEN],
					global: extras.isGlobal,
				};
			},
		)
		.build();