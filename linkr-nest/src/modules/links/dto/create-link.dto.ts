import { IsString, MinLength } from 'class-validator';

export class CreateLinkDto {
  @IsString()
  @MinLength(3, { message: 'Minimum of 3 characters required' })
  slug!: string;
}
