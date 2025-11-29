import { Auth } from "@/auth/auth.module.js";
import { AuthProvider } from "@/auth/interfaces/auth-provider.interface";
import { InjectPostgres } from "@/postgres/decorators/inject-postgres.decorator";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { betterAuth } from "better-auth";
import { Pool } from "pg";

@Injectable()
export class BetterAuthService<T extends Auth = Auth> implements AuthProvider<T> {
	private betterAuthInstance: T | null = null;

	constructor(
		@InjectPostgres() protected readonly postgres: Pool,
		protected readonly configService: ConfigService,
	) {}

	/**
	 * Gets the current Better Auth instance
	 * Creates the instance lazily on first call
	 * @returns The Better Auth instance
	 */
	getInstance(): T {
		if (!this.betterAuthInstance) {
			this.betterAuthInstance = betterAuth({
				database: this.postgres,
				secret: this.configService.get('app.secret'),
			}) as T;
		}
		return this.betterAuthInstance as T;
	}
}

