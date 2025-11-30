import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { InstallerService } from '../services/installer.service';
import { InstallerDto } from '../dtos/installer.dto';
import { InstallBetterAuthDto } from '../dtos/install-better-auth.dto';
import { AllowAnonymous } from '@/auth/decorators/auth.decorators';

@Controller('installer')
export class InstallerController {
	constructor(private readonly installerService: InstallerService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@AllowAnonymous()
	async getInstaller(): Promise<InstallerDto> {
		return this.installerService.getInstaller();
	}

	@Post('migrations')
	@HttpCode(HttpStatus.OK)
	@AllowAnonymous()
	async runMigrations(): Promise<InstallerDto> {
		return this.installerService.runMigrations();
	}

	@Post('better-auth')
	@HttpCode(HttpStatus.OK)
	@AllowAnonymous()
	async installBetterAuth(
		@Body() dto: InstallBetterAuthDto,
	): Promise<{ success: boolean; message?: string }> {
		return this.installerService.installBetterAuth(dto);
	}
}
