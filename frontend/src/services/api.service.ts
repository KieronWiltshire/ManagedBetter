const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export class ApiError extends Error {
	type: string;
	meta?: Record<string, unknown>;

	constructor(type: string, message: string, meta?: Record<string, unknown>) {
		super(message);
		this.type = type;
		this.meta = meta;
	}
}

/**
 * Makes an API request and handles errors
 * @throws {NotInstalledError} If the API returns a NotInstalled error
 */
export async function apiRequest<T>(
	endpoint: string,
	options?: RequestInit,
): Promise<T> {
	const url = `${API_URL}${endpoint}`;
	const response = await fetch(url, {
		...options,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...options?.headers,
		},
	});

	if (!response.ok) {
		const error = await response.json();

		throw new ApiError(
			error.type,
			error.message,
			error.meta,
		);
	}

	return response.json() as Promise<T>;
}


