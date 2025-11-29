import type { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext, type GqlContextType } from "@nestjs/graphql";
import type { Auth } from "@/auth/auth.module";
import type { AuthProvider } from "@/auth/interfaces/auth-provider.interface";

/**
 * Extracts the request object from either HTTP, GraphQL or WebSocket execution context
 * @param context - The execution context
 * @returns The request object
 */
export function getRequestFromContext(context: ExecutionContext) {
	const contextType = context.getType<GqlContextType>();
	if (contextType === "graphql") {
		return GqlExecutionContext.create(context).getContext().req;
	}

	if (contextType === "ws") {
		return context.switchToWs().getClient();
	}

	return context.switchToHttp().getRequest();
}

/**
 * Gets the auth instance from either an AuthProvider or a direct Auth instance
 * @param auth - Either an AuthProvider interface or a direct Auth instance
 * @returns The Auth instance
 */
export function getAuthInstance<T extends Auth = Auth>(
	auth: AuthProvider<T> | T,
): T {
	// Check if it's an AuthProvider (has a getInstance() method)
	if (
		typeof auth === "object" &&
		auth !== null &&
		"getInstance" in auth &&
		typeof (auth as AuthProvider<T>).getInstance === "function"
	) {
		return (auth as AuthProvider<T>).getInstance();
	}
	// Otherwise, it's a direct Auth instance
	return auth as T;
}