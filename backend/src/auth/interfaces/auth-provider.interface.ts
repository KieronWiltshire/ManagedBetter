import type { Auth } from "@/auth/auth.module";

/**
 * Interface for providing Better Auth instances
 * Allows for hot-swapping of auth instances at runtime
 */
export interface AuthProvider<T extends Auth = Auth> {
	/**
	 * Gets the current Better Auth instance
	 * @returns The Better Auth instance
	 */
	getInstance(): T;
}
