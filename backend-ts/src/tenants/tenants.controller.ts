import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  create(@Body(new ValidationPipe()) createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(createTenantDto);
  }
}
