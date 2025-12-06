import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { KyselyDao } from '@/database/kysely/kysely.dao';
import { DB } from '@/database/types/db';
import { sql } from 'kysely';

export interface ManagedBetterRow {
	key: string;
	value: unknown; // JSON value
	created_at: Date;
	updated_at: Date;
}

@Injectable()
export class ManagedBetterDao extends KyselyDao<ManagedBetterDao> {
	static readonly TABLE_NAME = 'managed_better';

	constructor(@InjectKysely() protected readonly kysely: Kysely<DB>) {
		super(kysely);
	}

	async get(key: string): Promise<ManagedBetterRow | undefined> {
		const row = await this.kysely
			.selectFrom(ManagedBetterDao.TABLE_NAME)
			.selectAll()
			.where('key', '=', key)
			.executeTakeFirst();

		if (!row) {
			return undefined;
		}

		return {
			...row,
			value: typeof row.value === 'string' ? JSON.parse(row.value) : row.value,
		};
	}

	async getAll(): Promise<ManagedBetterRow[]> {
		const rows = await this.kysely
			.selectFrom(ManagedBetterDao.TABLE_NAME)
			.selectAll()
			.execute();

		return rows.map((row) => ({
			...row,
			value: typeof row.value === 'string' ? JSON.parse(row.value) : row.value,
		}));
	}

	async set(key: string, value: unknown): Promise<void> {
		await this.kysely
			.insertInto(ManagedBetterDao.TABLE_NAME)
			.values({
				key,
				value: JSON.stringify(value) as any,
				created_at: sql`now()`,
				updated_at: sql`now()`,
			})
			.onConflict((oc) =>
				oc.column('key').doUpdateSet({
					value: JSON.stringify(value) as any,
					updated_at: sql`now()`,
				}),
			)
			.execute();
	}

	async delete(key: string): Promise<void> {
		await this.kysely
			.deleteFrom(ManagedBetterDao.TABLE_NAME)
			.where('key', '=', key)
			.execute();
	}

	async has(key: string): Promise<boolean> {
		const result = await this.kysely
			.selectFrom(ManagedBetterDao.TABLE_NAME)
			.select(sql<number>`1`.as('exists'))
			.where('key', '=', key)
			.executeTakeFirst();

		return !!result;
	}
}

