import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../common/dto/user-response.dto';
import { AccountResponseDto } from '../../common/dto/account-response.dto';

export class RegisterResponseDto {
  @ApiProperty({
    description: 'User information',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  @ApiProperty({
    description: 'Account information',
    type: AccountResponseDto,
  })
  account: AccountResponseDto;

  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;
}
