import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely, Migrator, FileMigrationProvider } from 'kysely';
import * as path from 'path';
import { promises as fs } from 'fs';
import { InstallerDto } from '../dtos/installer.dto';
import { InstallBetterAuthDto } from '../dtos/install-better-auth.dto';
import { MigrationStateDto } from '../dtos/migration-state.dto';
import { BetterAuthService } from '@/modules/betterauth/services/betterauth.service';
import { AlreadyInstalledException } from '../exceptions/already-installed.exception';
import { DB } from '@/database/types/db';
import { Auth } from 'better-auth/*';
import { getMigrations } from 'better-auth/db';
import { UnableToConfigureDatabaseException } from '../exceptions/unable-to-configure-database.exception';

@Injectable()
export class InstallerService {
	constructor(
		private readonly betterAuthService: BetterAuthService<Auth>,
		@InjectKysely() private readonly kysely: Kysely<DB>,
	) {}

	async getInstaller(): Promise<InstallerDto> {
		return {
			isInstalled: false,
			migrations: false,
		};
	}

	async runMigrations(): Promise<InstallerDto> {
		const installer = await this.getInstaller();

		if (installer.isInstalled) {
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

			// Run Better Auth migrations
			const { runMigrations } = await getMigrations(await this.betterAuthService.getConfigOptions());
			await runMigrations();

			// Run app migrations
			const { error, results }: any = await migrator.migrateToLatest();

			if (error) {
				throw new UnableToConfigureDatabaseException();
			}

			const failedMigrations = results?.filter((r) => r.status === 'Error') || [];
			if (failedMigrations.length > 0) {
				throw new UnableToConfigureDatabaseException();
			}

			return {
				isInstalled: false,
				migrations: true,
			}
		} catch (error) {
			throw error;
		}
	}

	async installBetterAuth(data: InstallBetterAuthDto): Promise<{ success: boolean; message?: string }> {
		const installer = await this.getInstaller();

		if (installer.isInstalled) {
			throw new AlreadyInstalledException();
		}

		try {
			const auth = this.betterAuthService.getInstance();
			
			// Create the admin user using Better Auth's signUpEmail API
			const result = await auth.api.signUpEmail({
				body: {
					email: data.email,
					password: data.password,
					name: data.name,
				},
			});

			if (result.error) {
				return {
					success: false,
					message: result.error.message || 'Failed to create admin user',
				};
			}

			return {
				success: true,
				message: 'Better Auth installed successfully',
			};
		} catch (error) {
			return {
				success: false,
				message: error instanceof Error ? error.message : 'Failed to install Better Auth',
			};
		}
	}
}
