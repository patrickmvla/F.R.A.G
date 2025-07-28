import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTenantDto {
  /* eslint-disable @typescript-eslint/no-unsafe-call */
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;
  /* eslint-enable @typescript-eslint/no-unsafe-call */
}
