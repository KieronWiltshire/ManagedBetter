import { Module } from '@nestjs/common';
import { InstallerController } from './controllers/installer.controller';
import { InstallerService } from './services/installer.service';

@Module({
  controllers: [InstallerController],
  providers: [InstallerService],
  exports: [InstallerService],
})
export class InstallerModule {}

