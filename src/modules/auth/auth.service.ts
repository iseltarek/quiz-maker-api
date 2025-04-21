/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/users.entity';
import { Repository } from 'typeorm';
import { RegisterRequestDto } from './dtos/auth-register-request.dto';
import * as bcrypt from 'bcrypt';
import { LoginRequestDto } from './dtos/auth-login-request.dto';
import { JwtService } from '@nestjs/jwt';
import { ErrorMessages } from './../../utlis/common/errorMessages';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  public async register(registerDto: RegisterRequestDto) {
    const { email, username, password, role } = registerDto;

    const user = await this.userRepository.findOneBy({ email });
    if (user) throw new BadRequestException(ErrorMessages.user.user_exist);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      username,
      role,
    });

    await this.userRepository.save(newUser);

    return {
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
    };
  }

  public async login(loginDto: LoginRequestDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role', 'username'],
    });
    if (!user)
      throw new UnauthorizedException(
        ErrorMessages.user.invalid_email_or_password,
      );

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      throw new UnauthorizedException(
        ErrorMessages.user.invalid_email_or_password,
      );

    const payload = {
      id: user.id,
      // username: user.username,
      // email: user.email,
      // role: user.role,
    };
    return {
      verificationToken: await this.jwtService.signAsync(payload, {
        noTimestamp: true,
      }),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }
}
