import { IsString, IsEmail, MinLength, Length, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsCPF } from '../../common/validators/cpf.validator';

export class CreateUserDto {
  @ApiProperty({ example: 'João Silva', description: 'Nome completo do usuário' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'joao@example.com', description: 'Email do usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha do usuário (mínimo 6 caracteres)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '12345678901', description: 'CPF do usuário (11 dígitos)' })
  @IsString()
  @Length(11, 11)
  @IsCPF()
  cpf: string;

  @ApiProperty({ enum: UserRole, example: 'USER', description: 'Papel do usuário', required: false })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
