import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely, Migrator, FileMigrationProvider } from 'kysely';
import * as path from 'path';
import { promises as fs } from 'fs';
import { InstallerDto, isInstalled } from '../dtos/installer.dto';
import { CreateAdminUserDto } from '../dtos/create-admin-user.dto';
import { BetterAuthService } from '@/modules/betterauth/services/betterauth.service';
import { AlreadyInstalledException } from '../exceptions/already-installed.exception';
import { DB } from '@/database/types/db';
import { Auth } from 'better-auth/*';
import { getMigrations } from 'better-auth/db';
import { UnableToConfigureDatabaseException } from '../exceptions/unable-to-configure-database.exception';
import { AdminOptions } from 'better-auth/plugins';
import { ManagedBetterService } from '@/modules/managed-better/services/managed-better.service';

@Injectable()
export class InstallerService {
	constructor(
		private readonly betterAuthService: BetterAuthService,
		private readonly managedBetterService: ManagedBetterService,
		@InjectKysely() private readonly kysely: Kysely<DB>,
	) {}

	async getInstaller(): Promise<InstallerDto> {
		try {
			const installer = await this.managedBetterService.get<InstallerDto>('installer');

			if (installer) {
				return installer;
			}
		} catch (error) {
			console.log(error);
		}

		return {
			betterAuthConfigured: false,
			adminUserCreated: false,
		}
	}

	async configureManagedBetter(): Promise<InstallerDto> {
		const installer = await this.getInstaller();

		if (isInstalled(installer)) {
			throw new AlreadyInstalledException();
		}

		try {
			const migrationFolder = path.join(
				process.cwd(),
				process.env.NODE_ENV === 'production' ? 'dist' : 'src',
				'database',
				'migrations',
			);

			const migrator = new Migrator({
				db: this.kysely,
				provider: new FileMigrationProvider({
					fs,
					path,
					migrationFolder,
				}),
			});

			const { error, results }: any = await migrator.migrateToLatest();

			if (error) {
				throw new UnableToConfigureDatabaseException();
			}

			const failedMigrations = results?.filter((r) => r.status === 'Error') || [];
			if (failedMigrations.length > 0) {
				throw new UnableToConfigureDatabaseException();
			}

			// Run Better Auth migrations
			const { runMigrations } = await getMigrations(await this.betterAuthService.getConfigOptions());
			await runMigrations();

			installer.betterAuthConfigured = true;

			// Store installer DTO in ManagedBetterService
			await this.managedBetterService.set('installer', installer);

			return installer;
		} catch (error) {
			throw error;
		}
	}

	async createAdminUser({ email, password, name }: CreateAdminUserDto): Promise<InstallerDto> {
		const installer = await this.getInstaller();

		if (isInstalled(installer)) {
			throw new AlreadyInstalledException();
		}

		try {
			// Create the admin user using Better Auth's createUser method from admin plugin
			const auth = await this.betterAuthService.getInstance();

			// Create the admin user
			await auth.api.createUser({
				body: {
					email,
					password,
					name,
					role: 'admin',
				}
			});

			installer.adminUserCreated = true;

			// Store installer DTO in ManagedBetterService
			await this.managedBetterService.set('installer', installer);

			return installer;
		} catch (error) {
			console.error(error);
			return installer;
		}
	}
}
