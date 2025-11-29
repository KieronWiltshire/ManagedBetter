import { Injectable } from '@nestjs/common';
import { InstallerDto } from '../dtos/installer.dto';

@Injectable()
export class InstallerService {
  async getInstaller(): Promise<InstallerDto> {
    return {
      installed: false,
    };
  }
}

