import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { InstallerService } from '../services/installer.service';
import { InstallerDto } from '../dtos/installer.dto';

@Controller('installer')
export class InstallerController {
  constructor(private readonly installerService: InstallerService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getInstaller(): Promise<InstallerDto> {
    return this.installerService.getInstaller();
  }
}

