import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { User } from 'src/modules/user/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.headers['user-id'];

    try {
      if (!userId) {
        throw new UnauthorizedException();
      }

      const user = await User.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new UnauthorizedException();
      }

      request['user'] = user;
    } catch (error) {
      console.log('Error: ', error);

      throw new UnauthorizedException();
    }

    return true;
  }
}
