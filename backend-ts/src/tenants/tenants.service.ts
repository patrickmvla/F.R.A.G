import { CreateTenantDto } from './dto/create-tenant.dto';
import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { tenants } from '../db/schema';
import * as schema from '../db/schema';
import { DRIZZLE_ORM } from 'src/drizzle/drizzle.constants';
import { randomBytes } from 'crypto';

@Injectable()
export class TenantsService {
  constructor(@Inject(DRIZZLE_ORM) private db: NodePgDatabase<typeof schema>) {}

  async create(createTenantDto: CreateTenantDto) {
    const newTenantId = `tenant_${randomBytes(16).toString('hex')}`;

    const [newTenant] = await this.db
      .insert(tenants)
      .values({ name: createTenantDto.name, tenantId: newTenantId })
      .returning();

    return newTenant;
  }
}
