import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ManagedBetterDao } from '../daos/managed-better.dao';

@Injectable()
export class ManagedBetterService {
	static readonly CACHE_KEY_PREFIX = 'managed_better:';

	constructor(
		private readonly dao: ManagedBetterDao,
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
	) {}

	private getCacheKey(key: string): string {
		return `${ManagedBetterService.CACHE_KEY_PREFIX}${key}`;
	}

	async get<T = unknown>(key: string): Promise<T | null> {
		// Try to get from cache first
		const cacheKey = this.getCacheKey(key);
		const cached = await this.cacheManager.get<T>(cacheKey);

		if (cached !== undefined && cached !== null) {
			return cached;
		}

		// If not in cache, get from database
		const row = await this.dao.get(key);

		if (!row) {
			return null;
		}

		// Store in cache and return (no TTL - cache persists until updated/deleted)
		const value = row.value as T;
		await this.cacheManager.set(cacheKey, value);

		return value;
	}

	async getAll(): Promise<Record<string, unknown>> {
		const rows = await this.dao.getAll();
		const result: Record<string, unknown> = {};

		// Cache all values (no TTL - cache persists until updated/deleted)
		for (const row of rows) {
			const cacheKey = this.getCacheKey(row.key);
			result[row.key] = row.value;
			await this.cacheManager.set(cacheKey, row.value);
		}

		return result;
	}

	async set(key: string, value: unknown): Promise<void> {
		// Update database
		await this.dao.set(key, value);

		// Update cache (no TTL - cache persists until updated/deleted)
		const cacheKey = this.getCacheKey(key);
		await this.cacheManager.set(cacheKey, value);
	}

	async delete(key: string): Promise<void> {
		// Delete from database
		await this.dao.delete(key);

		// Delete from cache
		const cacheKey = this.getCacheKey(key);
		await this.cacheManager.del(cacheKey);
	}

	async has(key: string): Promise<boolean> {
		// Check cache first
		const cacheKey = this.getCacheKey(key);
		const cached = await this.cacheManager.get(cacheKey);

		if (cached !== undefined && cached !== null) {
			return true;
		}

		// If not in cache, check database
		return await this.dao.has(key);
	}
}

