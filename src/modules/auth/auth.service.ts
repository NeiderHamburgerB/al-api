import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { IUser } from 'src/interfaces/IUser.interface';
import { compareSync } from 'bcryptjs';
import { UserService } from 'src/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private studentsService: UserService,
    private jwtService: JwtService,
  ) {}

  async validate(email: string, pass: string) {
    const user = await this.studentsService.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    if (!compareSync(pass, user.password))
      throw new NotAcceptableException('User or password incorrect');

    let { password, ...rest } = user;

    return rest;
  }

  async login(user: IUser) {

    const { id } = user;

    const payload = { sub: id };

    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
 
  }

  /**
   * It returns an object with an accessToken with 1s of expiration
   * @param {User} userData - User - This is the user object that is passed in from the client.
   * @returns An object with an accessToken and a user object.
   */
  async logout(userData: IUser) {
    const { password, ...rest } = userData
    return {
      accessToken: this.jwtService.sign({ test: 'test' }, { expiresIn: '1s' }),
      user: rest,
    };
  }


}
