import { IsString, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  CREATOR = 'creator',
  VIEWER = 'viewer',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
