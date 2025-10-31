import { IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  email!: string;

  @IsString()
  userAgent!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  confirmPassword!: string;
}
