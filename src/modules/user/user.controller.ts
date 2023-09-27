import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import to from 'await-to-js';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Register Endpoint',
    description: 'Endpoint to register user.',
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const [error, response] = await to(
      this.userService.create(createUserDto),
    );
    if (error) {
      throw new BadRequestException(error);
    }

    return response;
  }

}
