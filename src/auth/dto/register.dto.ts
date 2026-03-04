import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'dev@acme.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
