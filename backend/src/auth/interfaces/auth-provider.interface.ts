import type { Auth } from "@/auth/auth.module";
import { BetterAuthOptions } from "better-auth/*";

/**
 * Interface for providing Better Auth instances
 * Allows for hot-swapping of auth instances at runtime
 */
export interface AuthProvider<T extends Auth = Auth> {

	/**
	 * Gets the config options for the Better Auth instance
	 * @returns The config options
	 */
	getConfigOptions(): Promise<BetterAuthOptions>;

	/**
	 * Gets the current Better Auth instance
	 * @returns The Better Auth instance
	 */
	getInstance(): Promise<T>;
}
