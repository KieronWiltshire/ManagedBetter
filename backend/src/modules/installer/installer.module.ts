import { Module } from '@nestjs/common';
import { InstallerController } from './controllers/installer.controller';
import { InstallerService } from './services/installer.service';
import { BetterAuthModule } from '../betterauth/betterauth.module';
import { KyselyModule } from 'nestjs-kysely';

@Module({
  imports: [BetterAuthModule, KyselyModule],
  controllers: [InstallerController],
  providers: [InstallerService],
  exports: [InstallerService],
})
export class InstallerModule {}

