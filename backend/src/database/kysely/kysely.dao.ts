import { Kysely, Transaction } from 'kysely';
import { BaseTransaction } from '@/database/base-transaction';
import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { DB } from '../types/db';

@Injectable()
export abstract class KyselyDao<T extends KyselyDao<T>> {
  private readonly createInstance: new (kysely: Kysely<DB>) => T;

  constructor(@InjectKysely() protected readonly kysely: Kysely<DB>) {}

  async transaction<T>(
    callback: (transaction: BaseTransaction<Transaction<DB>>) => Promise<T>,
  ) {
    return await this.kysely.transaction().execute(async (kyselyTransaction) => {
      const baseTransaction = new BaseTransaction(kyselyTransaction);
      return callback(baseTransaction);
    });
  }

  transacting(transaction: BaseTransaction<Transaction<DB>>): T {
    return new this.createInstance(transaction.instance() as Kysely<DB>);
  }
}