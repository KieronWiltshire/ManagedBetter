import { Module } from '@nestjs/common';
import { KyselyModule } from 'nestjs-kysely';
import { ManagedBetterDao } from './daos/managed-better.dao';
import { ManagedBetterService } from './services/managed-better.service';

@Module({
	imports: [KyselyModule],
	providers: [ManagedBetterDao, ManagedBetterService],
	exports: [ManagedBetterService],
})
export class ManagedBetterModule {}

