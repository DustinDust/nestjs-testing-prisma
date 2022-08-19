import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutDownHook(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async truncate() {
    const records = await this.$queryRawUnsafe<Array<any>>(
      `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`,
    );

    records.forEach((record) => this.truncateTable(record['tablename']));
  }

  async truncateTable(tablename) {
    if (tablename === undefined || tablename === '_prisma_migrations') {
      return;
    }
    try {
      await this.$executeRawUnsafe(
        `TRUNCATE TABLE "public"."${tablename}" CASCADE`,
      );
    } catch (e) {
      console.log(e);
    }
  }

  async resetSequence() {
    const results = await this.$queryRawUnsafe<Array<any>>(
      `SELECT c.relname
       FROM pg_class AS c
                JOIN pg_namespace AS n ON c.relnamespace = n.oid
       WHERE c.relkind = 'S'
         AND n.nspname = 'public'`,
    );
    for (const { record } of results) {
      // eslint-disable-next-line no-await-in-loop
      await this.$executeRawUnsafe(
        `ALTER SEQUENCE "public"."${record['relname']}" RESTART WITH 1;`,
      );
    }
  }
}
