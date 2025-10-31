import { IsString } from 'class-validator';

export class CreateRedirectionDto {
  @IsString()
  redirectTo!: string;
}
