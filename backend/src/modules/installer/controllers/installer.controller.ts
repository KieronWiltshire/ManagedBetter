import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { InstallerService } from '../services/installer.service';
import { InstallerDto, isInstalled } from '../dtos/installer.dto';
import { CreateAdminUserDto } from '../dtos/create-admin-user.dto';
import { AllowAnonymous } from '@/auth/decorators/auth.decorators';

@Controller('installer')
export class InstallerController {
	constructor(private readonly installerService: InstallerService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@AllowAnonymous()
	async getInstaller(): Promise<InstallerDto & { isInstalled: boolean }> {
		const installer = await this.installerService.getInstaller();
		return {
			...installer,
			isInstalled: isInstalled(installer),
		};
	}

	@Post('managed-better')
	@HttpCode(HttpStatus.OK)
	@AllowAnonymous()
	async configureManagedBetter(): Promise<InstallerDto & { isInstalled: boolean }> {
		const installer = await this.installerService.configureManagedBetter();
		return {
			...installer,
			isInstalled: isInstalled(installer),
		};
	}

	@Post('admin-user')
	@HttpCode(HttpStatus.OK)
	@AllowAnonymous()
	async createAdminUser(
		@Body() dto: CreateAdminUserDto,
	): Promise<InstallerDto & { isInstalled: boolean }> {
		const installer = await this.installerService.createAdminUser(dto);
		return {
			...installer,
			isInstalled: isInstalled(installer),
		};
	}
}
