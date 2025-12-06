import type { Auth } from "@/auth/auth.module";
import { GetConfigOptionsParams } from "@/modules/betterauth/services/betterauth.service";
import { BetterAuthOptions } from "better-auth/*";

export type AuthProviderOptions = {
	isManagedBetterRequest?: boolean;
};

/**
 * Interface for providing Better Auth instances
 * Allows for hot-swapping of auth instances at runtime
 */
export interface AuthProvider<T extends Auth = Auth> {

	/**
	 * Gets the config options for the Better Auth instance
	 * @returns The config options
	 */
	getConfigOptions(providerOptions?: AuthProviderOptions): Promise<BetterAuthOptions>;

	/**
	 * Gets the current Better Auth instance
	 * @returns The Better Auth instance
	 */
	getInstance(providerOptions?: AuthProviderOptions): Promise<T>;
}
