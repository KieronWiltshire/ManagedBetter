import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable('managed_better')
		.addColumn('key', 'varchar(255)', (col) => col.primaryKey().notNull())
		.addColumn('value', sql`jsonb`, (col) => col.notNull())
		.addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
		.addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
		.execute()
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable('managed_better').execute()
}
