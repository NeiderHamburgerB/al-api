import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './transaction.dto';
import { DataSource, EntityManager, Repository } from 'typeorm';
import to from 'await-to-js';
import { Transaction } from 'src/models/transaction/transaction.entity';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/utils/pagination';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TransactionService {

  constructor(
    private dataSource: DataSource,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,) { }


  async create(createTransactionDto: CreateTransactionDto) {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create transaction
      const [errorTransaction, transaction] = await to<Transaction>(
        this.createTransaction(
          queryRunner.manager,
          createTransactionDto
        ),
      );

      if (errorTransaction) {
        throw new BadRequestException(errorTransaction);
      }

      await queryRunner.commitTransaction();

      return transaction.id;

    } catch (error: Error | any) {

      await queryRunner.rollbackTransaction();
      // Internal Error
      throw error;

    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }

  }

  private async createTransaction(
    entityManager: EntityManager,
    transactionInfo: CreateTransactionDto,
  ): Promise<Transaction> {

    const transaction = entityManager.create<Transaction>(Transaction, transactionInfo);

    const [errorTransaction, newTransaction] = await to(entityManager.save(Transaction, transaction));

    if (errorTransaction) {
      throw new BadRequestException(errorTransaction);
    }

    return newTransaction;
  }


  async findAll(pageOptionsDto: PageOptionsDto, user_id:number): Promise<PageDto<Transaction>> {
    
    const queryBuilder = this.transactionRepository.createQueryBuilder('transactions');

    queryBuilder
      .where('transactions.user_id = :user_id', { user_id })
      .orderBy('transactions.created_at', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const total = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);

  }

 

}
