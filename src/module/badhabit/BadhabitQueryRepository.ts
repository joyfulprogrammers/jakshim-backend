import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Badhabit } from 'src/entity/domain/badhabit/Badhabit.entity';

@Injectable()
export class BadhabitQueryRepository {
  constructor(
    @InjectRepository(Badhabit)
    private readonly badhabitRepository: EntityRepository<Badhabit>,
  ) {}
}
