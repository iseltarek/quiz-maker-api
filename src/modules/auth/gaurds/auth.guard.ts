/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ErrorMessages } from 'src/utlis/common/errorMessages';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(ErrorMessages.auth.unauthorized);
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: '123',
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException(ErrorMessages.auth.unauthorized);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return type === 'Bearer' ? token : undefined;
  }
}
