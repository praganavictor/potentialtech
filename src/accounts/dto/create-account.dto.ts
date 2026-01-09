import { IsInt } from 'class-validator';

export class CreateAccountDto {
  @IsInt()
  userId: number;
}
