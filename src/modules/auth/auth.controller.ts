import { Controller, Post, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { LocalGuard } from 'src/config/passport/guards/local.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { User } from 'src/common/decorators/user.decorators';
import { IUser } from 'src/interfaces/IUser.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorators';
import to from 'await-to-js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('login')
  @ApiOperation({
    summary: 'Login Endpoint',
    description: 'Endpoint to authenticate and log in a user.',
  })
  login(@User() user: IUser, @Body() data: LoginDto) {
    try {
      return this.authService.login(user);
    } catch (err) {
      return {
        statusCode: 500,
        message: err,
      };
    }
  }


  @Auth()
  @ApiOperation({
    summary: 'Logout Endpoint',
    description: 'Endpoint to logout user.',
  })
  @Post('logout')
  async logout(@User() user: IUser) {
    const [error, response] = await to(
      this.authService.logout(user),
    ); 
    if (error) throw new BadRequestException(error);

    return response;
  }



}
