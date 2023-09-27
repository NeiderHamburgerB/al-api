import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GoogleApisModule } from './google-apis/google-apis.module';

@Module({
  imports: [AuthModule,UserModule, GoogleApisModule],
  controllers: [],
})
export class ApiModule {}