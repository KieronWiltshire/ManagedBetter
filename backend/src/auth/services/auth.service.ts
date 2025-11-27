import { Inject } from "@nestjs/common";
import type { Auth } from "better-auth";
import { AuthModuleOptions, MODULE_OPTIONS_TOKEN } from "@/auth/auth.module-definition";
import { getAuthInstance } from "@/auth/utilities/auth.utilities";

/**
 * NestJS service that provides access to the Better Auth instance
 * Use generics to support auth instances extended by plugins
 */
export class AuthService<T extends { api: T["api"] } = Auth> {
	constructor(
		@Inject(MODULE_OPTIONS_TOKEN)
		private readonly options: AuthModuleOptions<T>,
	) {}

	/**
	 * Returns the API endpoints provided by the auth instance
	 */
	get api(): T["api"] {
		return getAuthInstance(this.options.auth).api;
	}

	/**
	 * Returns the complete auth instance
	 * Access this for plugin-specific functionality
	 */
	get instance(): T {
		return getAuthInstance(this.options.auth);
	}
}