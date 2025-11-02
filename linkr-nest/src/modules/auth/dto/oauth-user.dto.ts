import { IsString, MaxLength, MinLength } from 'class-validator';

export class OauthUserDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  email!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  given_name!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  family_name!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  googleId!: string;

  @IsString()
  picture!: string;
}
