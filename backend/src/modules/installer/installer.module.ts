import { Module } from '@nestjs/common';
import { InstallerController } from './controllers/installer.controller';
import { InstallerService } from './services/installer.service';
import { BetterAuthModule } from '../betterauth/betterauth.module';
import { KyselyModule } from 'nestjs-kysely';
import { ManagedBetterModule } from '../managed-better/managed-better.module';

@Module({
  imports: [BetterAuthModule, KyselyModule, ManagedBetterModule],
  controllers: [InstallerController],
  providers: [InstallerService],
  exports: [InstallerService],
})
export class InstallerModule {}

