import { Module } from '@nestjs/common';
import { DrizzleProvider } from './drizzle.provider';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

@Module({
  imports: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../../../.env'),
    }),
  ],

  providers: [DrizzleProvider],

  exports: [DrizzleProvider],
})
export class DrizzleModule {}
