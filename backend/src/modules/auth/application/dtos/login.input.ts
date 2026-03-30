import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginInput {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
