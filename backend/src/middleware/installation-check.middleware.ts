import type { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { InstallerService } from '@/modules/installer/services/installer.service';
import { NotInstalledException } from '@/modules/installer/exceptions/not-installed.exception';

@Injectable()
export class InstallationCheckMiddleware implements NestMiddleware {
  constructor(
    @Inject(forwardRef(() => InstallerService))
    private readonly installerService: InstallerService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Check installation status
    const status = await this.installerService.getInstaller();

    const isInstalled = status.installed;
    const isInstallerRoute = req.path.startsWith('/installer');

    // If app is installed, block installer routes
    if (isInstalled && isInstallerRoute) {
      throw new NotFoundException();
    }

    // If app is not installed, block all routes except installer routes
    if (!isInstalled && !isInstallerRoute) {
      throw new NotInstalledException();
    }

    next();
  }
}

