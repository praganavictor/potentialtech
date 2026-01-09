import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUserByEmail) {
      throw new ConflictException('Email already registered');
    }

    const existingUserByCpf = await this.prisma.user.findUnique({
      where: { cpf: createUserDto.cpf },
    });

    if (existingUserByCpf) {
      throw new ConflictException('CPF already registered');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const { password, ...userData } = createUserDto;

    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        role: true,
        createdAt: true,
      },
    });
  }
}
