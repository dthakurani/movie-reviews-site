import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async createOrLogin(@Body() body: CreateUserDto) {
    return await this.userService.createOrLogin(body);
  }
}
