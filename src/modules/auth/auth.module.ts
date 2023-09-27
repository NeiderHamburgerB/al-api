import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalService } from 'src/config/passport/services/local.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from 'src/config/passport/passport.module';
import { JwtService } from 'src/config/passport/services/jwt.service';

@Module({
  imports: [UserModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, LocalService, JwtService],
})
export class AuthModule {}
