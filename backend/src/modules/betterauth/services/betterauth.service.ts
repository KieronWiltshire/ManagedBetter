import { AuthProvider, AuthProviderOptions } from "@/auth/interfaces/auth-provider.interface";
import { InjectPostgres } from "@/postgres/decorators/inject-postgres.decorator";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { betterAuth, BetterAuthOptions, SecondaryStorage } from "better-auth";
import { Pool } from "pg";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { admin } from "better-auth/plugins";
import { Auth } from "@/auth/auth.module";

@Injectable()
export class BetterAuthService implements AuthProvider<Auth> {
	private betterAuthInstance: Auth;

	constructor(
		@InjectPostgres() protected readonly postgres: Pool,
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
		protected readonly configService: ConfigService,
	) {}

	async getConfigOptions({ isManagedBetterRequest }: AuthProviderOptions = {}): Promise<BetterAuthOptions> {
		const signUpEnabled = isManagedBetterRequest; // TODO: check from database if sign up is enabled
		const disableSignUp = isManagedBetterRequest || signUpEnabled;

		let config: BetterAuthOptions = {
			emailAndPassword: {
				enabled: true,
				disableSignUp,
			},
			database: this.postgres,
			secondaryStorage: this.cacheManager as unknown as SecondaryStorage,
			secret: this.configService.get('app.secret'),
			plugins: [
				admin(),
			]
		};

		return config;
	}

	async getInstance(configOptions: AuthProviderOptions = {}): Promise<Auth> {
		if (!this.betterAuthInstance) {
			const config = await this.getConfigOptions(configOptions);
			this.betterAuthInstance = betterAuth(config) as Auth;
		}
		return this.betterAuthInstance;
	}
}
