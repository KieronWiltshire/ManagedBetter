"use server";

import { ApiError, apiRequest } from "@/services/api.service";

export interface InstallerStatus {
	isInstalled: boolean;
	migrations: boolean;
}

export interface BetterAuthInstallData {
	email: string;
	password: string;
	name: string;
}

export async function checkInstallationStatus(): Promise<InstallerStatus> {
	return await apiRequest<InstallerStatus>("/api/installer");
}

export async function runMigrations(): Promise<InstallerStatus> {
	return await apiRequest<InstallerStatus>(
		"/api/installer/migrations",
		{
			method: "POST",
		},
	);
}

export async function installBetterAuth(
	data: BetterAuthInstallData,
): Promise<{ success: boolean; message?: string }> {
	return await apiRequest<{ success: boolean; message?: string }>(
		"/api/installer/better-auth",
		{
			method: "POST",
			body: JSON.stringify(data),
		},
	);
}
