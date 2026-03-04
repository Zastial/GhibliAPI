import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@ghibli.dev' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
