export class InstallerDto {
    betterAuthConfigured: boolean;
    adminUserCreated: boolean;
}

export function isInstalled(dto: InstallerDto): boolean {
    return dto.betterAuthConfigured && dto.adminUserCreated;
}

