"use server";

import { ApiError, apiRequest } from "@/services/api.service";

export interface InstallerStatus {
	isInstalled: boolean;
	betterAuthConfigured: boolean;
	adminUserCreated: boolean;
}

export interface CreateAdminUserData {
	email: string;
	password: string;
	name: string;
}

export async function checkInstallationStatus(): Promise<InstallerStatus> {
	return await apiRequest<InstallerStatus>("/api/installer");
}

export async function configureManagedBetter(): Promise<InstallerStatus> {
	return await apiRequest<InstallerStatus>(
		"/api/installer/managed-better",
		{
			method: "POST",
		},
	);
}

export async function createAdminUser(
	data: CreateAdminUserData,
): Promise<InstallerStatus> {
	return await apiRequest<InstallerStatus>(
		"/api/installer/admin-user",
		{
			method: "POST",
			body: JSON.stringify(data),
		},
	);
}
