import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GoogleApisService } from './google-apis.service';
import { GoogleApisController } from './google-apis.controller';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [HttpModule, TransactionModule],
  controllers: [GoogleApisController],
  providers: [GoogleApisService],
  exports: [GoogleApisService],
})
export class GoogleApisModule {}
