import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CustomException } from 'src/utilities/custom-exception.utility';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createOrLogin(body: CreateUserDto) {
    const [userWithEmail, userWithUsername] = await Promise.all([
      this.userRepository.findOne({
        where: { email: body.email },
      }),
      this.userRepository.findOne({
        where: { username: ILike(body.username) },
      }),
    ]);

    if (
      userWithEmail &&
      body.username.toLowerCase() === userWithEmail.username.toLowerCase()
    ) {
      return userWithEmail;
    } else if (
      userWithEmail &&
      body.username.toLowerCase() !== userWithEmail.username.toLowerCase()
    ) {
      throw new CustomException(
        'Email already exists but username does not match',
        'username',
        HttpStatus.UNAUTHORIZED,
      );
    } else if (userWithUsername) {
      throw new CustomException(
        'Username already exists',
        'username',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const newUser = await this.userRepository.save(body);

    return newUser;
  }
}
