import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { User } from 'src/models/user/user.entity';
import { hashSync, genSaltSync } from 'bcryptjs'
import to from 'await-to-js';
import { IUserSearch } from 'src/interfaces/IUserSearch.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {

  constructor(
    private dataSource: DataSource,
    @InjectRepository(User)
    private userRepository: Repository<User>,) { }

  async create(createUserDto: CreateUserDto) {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create user
      const [errorUser, user] = await to<User>(
        this.createUser(
          queryRunner.manager,
          createUserDto
        ),
      );

      if (errorUser) {
        throw new BadRequestException(errorUser);
      }

      await queryRunner.commitTransaction();

      return user.id;

    } catch (error: Error | any) {

      await queryRunner.rollbackTransaction();
      // Internal Error
      throw error;

    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }

  }

  private async createUser(
    entityManager: EntityManager,
    userInfo: CreateUserDto,
  ): Promise<User> {
    //Creating user
    const [errorExist, exists] = await to(
      entityManager.findOne(User, {
        where: {
          email: userInfo.email,
        },
        select: ['id'],
      }),
    );

    if (errorExist) {
      throw new BadRequestException(errorExist);
    }

    if (exists) {
      throw new BadRequestException({
        message: 'El email con el que se intenta registrar no está disponible'
      });
    }

    const user = entityManager.create<User>(User, userInfo);

    user.password = await this.encryptPassword(user.password); //encrypt

    const [errorUser, newUser] = await to(entityManager.save(User, user));

    delete user.password;

    if (errorUser) {
      throw new BadRequestException(errorUser);
    }

    return newUser;
  }

  encryptPassword(password: string) {
    return hashSync(password, genSaltSync(8));
  }

  async findOne(data: IUserSearch) {
    const [error, user] = await to(
      this.userRepository.findOne({
        where: data
      }),
    );

    if (error) {
      throw new BadRequestException(error);
    }

    if (!user) {
      throw new NotFoundException({
        message: 'El usuario no existe.',
      });
    }
    return user;
  }

}
