import { UserRole } from '@prisma/client';

export class UserPayloadDto {
  userId: number;
  email: string;
  role: UserRole;
}
