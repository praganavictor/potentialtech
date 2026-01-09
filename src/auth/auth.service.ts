import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AccountsService } from '../accounts/accounts.service';
import { AuditService } from '../audit/audit.service';
import { RegisterDto } from './dto/register.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { UserResponseDto } from '../common/dto/user-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly accountsService: AccountsService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: UserResponseDto): Promise<LoginResponseDto> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role
    };

    const access_token = this.jwtService.sign(payload);

    await this.auditService.log(
      user.id,
      'LOGIN',
      'auth',
      {
        email: user.email,
        timestamp: new Date().toISOString(),
      },
    );

    return {
      access_token,
    };
  }

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    const user = await this.usersService.create(registerDto);
    const account = await this.accountsService.create(user.id);

    await this.auditService.log(
      user.id,
      'LOGIN',
      'auth',
      {
        email: user.email,
        accountNumber: account.accountNumber,
        timestamp: new Date().toISOString(),
      },
    );

    const { access_token } = await this.login(user);

    return {
      user,
      account,
      access_token,
    };
  }
}
