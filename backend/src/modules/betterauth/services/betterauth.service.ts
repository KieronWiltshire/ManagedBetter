import { Auth } from "@/auth/auth.module.js";
import { AuthProvider } from "@/auth/interfaces/auth-provider.interface";
import { InjectPostgres } from "@/postgres/decorators/inject-postgres.decorator";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { betterAuth, BetterAuthOptions, SecondaryStorage } from "better-auth";
import { Pool } from "pg";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class BetterAuthService<T extends Auth = Auth> implements AuthProvider<T> {
	private betterAuthInstance: T | null = null;

	constructor(
		@InjectPostgres() protected readonly postgres: Pool,
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
		protected readonly configService: ConfigService,
	) {}

	async getConfigOptions(): Promise<BetterAuthOptions> {
		return {
			database: this.postgres,
			secondaryStorage: this.cacheManager as unknown as SecondaryStorage,
			secret: this.configService.get('app.secret'),
		};
	}

	/**
	 * Gets the current Better Auth instance
	 * Creates the instance lazily on first call
	 * @returns The Better Auth instance
	 */
	async getInstance(): Promise<T> {
		if (!this.betterAuthInstance) {
			const config = await this.getConfigOptions();
			this.betterAuthInstance = betterAuth(config) as T;
		}
		return this.betterAuthInstance as T;
	}
}

