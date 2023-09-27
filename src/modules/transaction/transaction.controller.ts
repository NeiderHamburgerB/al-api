import { Controller, Get, BadRequestException, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import to from 'await-to-js';
import { Auth } from 'src/common/decorators/auth.decorators';
import { PageOptionsDto } from 'src/common/utils/pagination';
import { User } from 'src/common/decorators/user.decorators';
import { IUser } from 'src/interfaces/IUser.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Auth()
  @ApiOperation({
    summary: 'Get Endpoint (WITH AUTHENTICATION)',
    description: 'Endpoint to get logged in user history paginated.',
  })
  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto, @User() user: IUser) {
    const [error, response] = await to(
      this.transactionService.findAll(pageOptionsDto, user.id),
    );

    if (error) {
      throw new BadRequestException(error);
    }

    return response;
  }

}
