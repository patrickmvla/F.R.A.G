import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  /* eslint-disable @typescript-eslint/no-unsafe-call */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  tenantId: string;
}
