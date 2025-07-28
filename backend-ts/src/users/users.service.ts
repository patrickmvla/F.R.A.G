import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schema from '../db/schema';
import { DRIZZLE_ORM } from 'src/drizzle/drizzle.constants';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE_ORM) private db: NodePgDatabase<typeof schema>) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = await this.db
      .insert(schema.users)
      .values(createUserDto)
      .returning();

    return newUser[0];
  }
}
