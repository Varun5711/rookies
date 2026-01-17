import { DynamicModule, Module, Global } from '@nestjs/common';
import { ClickHouseClient, createClient } from '@clickhouse/client';

export interface ClickHouseModuleOptions {
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
}

export const CLICKHOUSE_CLIENT = 'CLICKHOUSE_CLIENT';

@Global()
@Module({})
export class ClickHouseModule {
  static forRoot(options: ClickHouseModuleOptions = {}): DynamicModule {
    const clickhouseProvider = {
      provide: CLICKHOUSE_CLIENT,
      useFactory: (): ClickHouseClient => {
        const client = createClient({
          host: options.host || process.env.CLICKHOUSE_HOST || 'http://localhost:8123',
          username: options.username || process.env.CLICKHOUSE_USER || 'default',
          password: options.password || process.env.CLICKHOUSE_PASSWORD || 'clickhouse',
          database: options.database || process.env.CLICKHOUSE_DB || 'ingenium_audit',
          clickhouse_settings: {
            async_insert: 1,
            wait_for_async_insert: 0,
          },
        });

        return client;
      },
    };

    return {
      module: ClickHouseModule,
      providers: [clickhouseProvider],
      exports: [clickhouseProvider],
    };
  }
}
