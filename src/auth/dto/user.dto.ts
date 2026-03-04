import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsUUID,
  IsISO8601,
} from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export class User {
  @IsUUID()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  apiKey: string;

  @IsISO8601()
  createdAt: string;
}
