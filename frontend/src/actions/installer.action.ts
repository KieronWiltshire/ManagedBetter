"use server";

import { ApiError, apiRequest } from "@/services/api.service";

export interface InstallerStatus {
	installed: boolean;
}

export async function checkInstallationStatus(): Promise<InstallerStatus> {
	try {
		return await apiRequest<InstallerStatus>("/api/auth");
	} catch (error) {
		if (error instanceof ApiError && error.type === "NotInstalled") {
			return { installed: false };
		}
		throw error;
	}
}

