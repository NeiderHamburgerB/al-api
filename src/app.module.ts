import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './modules';
import { EnvModule } from './config/env/env.module';
import { DatabaseModule } from './config/database/database.module';
import { TransactionModule } from './modules/transaction/transaction.module';

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    ApiModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
