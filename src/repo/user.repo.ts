import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../Entity/legacy/users';
import { Query } from 'json-api-nestjs';

@Injectable()
export class YourEntityRepository extends Repository<Users> {
  constructor(
    @InjectRepository(Users) private readonly repo: Repository<Users>,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async aggregateByField(field: string) {
    return this.repo
      .createQueryBuilder('entity')
      .select(`entity.${field}`, 'groupedField')
      .addSelect('COUNT(*)', 'count')
      .groupBy(`entity.${field}`)
      .getRawMany();
  }

  async aggregateByFieldSort(query: Query<Users>, field: string) {
    let qb = this.repo
      .createQueryBuilder('entity')
      .select(`entity.${field}`, 'groupedField')
      .addSelect('COUNT(*)', 'count')
      .groupBy(`entity.${field}`);

    // Apply QueryType filters (sorting, pagination, etc.)
    // applyQuery(query, qb);
    // qb = applyQuery(qb, query) as SelectQueryBuilder<Users>;

    return qb.getRawMany();
  }
}
