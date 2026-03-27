import { IsString, IsEnum } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  CREATOR = 'creator',
  VIEWER = 'viewer',
}

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEnum(UserRole)
  role: UserRole;
}
