import { PrismaAdapterHelper } from './../../../InfrastructureLayer/Helpers/PrismaAdapterHelper';
import { ModelProxy, QuerySpec } from '../DatabaseAdapter';

export class PrismaModelProxy<T> implements ModelProxy<T> {
  constructor(private modelDelegate: any) {}

  insert(doc: Partial<T>) {
    return this.modelDelegate.create({ data: doc });
  }

  async find(spec?: QuerySpec) {
    const args: any = {};

    if (spec?.filter)
      args.where = PrismaAdapterHelper.toPrismaWhere(spec.filter);

    // sort priority: spec.sort -> extras.orderBy
    if (spec?.sort)
      args.orderBy = PrismaAdapterHelper.toPrismaOrderBy(spec.sort);
    if (spec?.extras?.orderBy) args.orderBy = spec.extras.orderBy;

    // include priority: extras.include -> relations
    if (spec?.extras?.include) args.include = spec.extras.include;
    else if (spec?.relations)
      args.include = PrismaAdapterHelper.toPrismaInclude(
        spec.relations,
        spec.extras,
      );

    // select priority: extras.select -> spec.select
    if (spec?.extras?.select) args.select = spec.extras.select;
    else if (spec?.select)
      args.select = spec.select.reduce((a, f) => ({ ...a, [f]: true }), {});

    // pagination: prefer explicit skip/take in extras, otherwise spec.pagination
    if (spec?.extras?.skip !== undefined) args.skip = spec.extras.skip;
    if (spec?.extras?.take !== undefined) args.take = spec.extras.take;
    if (spec?.extras?.cursor !== undefined) args.cursor = spec.extras.cursor;

    if (spec?.pagination) {
      if (spec.pagination.skip !== undefined) args.skip = spec.pagination.skip;
      if (spec.pagination.limit !== undefined)
        args.take = spec.pagination.limit;
      if (spec.pagination.page && spec.pagination.pageSize) {
        args.skip = (spec.pagination.page - 1) * spec.pagination.pageSize;
        args.take = spec.pagination.pageSize;
      }
    }

    return this.modelDelegate.findMany(args);
  }

  async findOne(spec?: QuerySpec) {
    const args: any = {};
    if (spec?.filter)
      args.where = PrismaAdapterHelper.toPrismaWhere(spec.filter);

    if (spec?.extras?.include) args.include = spec.extras.include;
    else if (spec?.relations)
      args.include = PrismaAdapterHelper.toPrismaInclude(
        spec.relations,
        spec.extras,
      );

    if (spec?.extras?.select) args.select = spec.extras.select;
    else if (spec?.select)
      args.select = spec.select.reduce((a, f) => ({ ...a, [f]: true }), {});

    // Allow extras.cursor / skip / take at top-level if provided (escape hatch)
    if (spec?.extras?.cursor !== undefined) args.cursor = spec.extras.cursor;
    if (spec?.extras?.skip !== undefined) args.skip = spec.extras.skip;
    if (spec?.extras?.take !== undefined) args.take = spec.extras.take;
    if (spec?.extras?.orderBy !== undefined) args.orderBy = spec.extras.orderBy;

    // Prefer findUnique when possible; otherwise fallback to findFirst
    try {
      return await this.modelDelegate.findUnique(args);
    } catch {
      return this.modelDelegate.findFirst(args);
    }
  }

  async updateOne(spec: QuerySpec, update: Partial<T>) {
    const where = PrismaAdapterHelper.toPrismaWhere(spec.filter);
    try {
      // if extras.include present, pass it through to return includes
      const args: any = { where, data: update };
      if (spec?.extras?.include) args.include = spec.extras.include;
      return await this.modelDelegate.update(args);
    } catch {
      // fallback for non-unique updates
      await this.modelDelegate.updateMany({ where, data: update });
      return this.modelDelegate.findFirst({ where });
    }
  }

  updateMany(spec: QuerySpec, update: Partial<T>) {
    const where = PrismaAdapterHelper.toPrismaWhere(spec.filter);
    return this.modelDelegate.updateMany({ where, data: update });
  }

  deleteOne(spec: QuerySpec) {
    const where = PrismaAdapterHelper.toPrismaWhere(spec.filter);
    return this.modelDelegate.delete({ where });
  }

  deleteMany(spec: QuerySpec) {
    const where = PrismaAdapterHelper.toPrismaWhere(spec.filter);
    return this.modelDelegate.deleteMany({ where });
  }

  count(spec?: QuerySpec) {
    const where = spec?.filter
      ? PrismaAdapterHelper.toPrismaWhere(spec.filter)
      : undefined;
    return this.modelDelegate.count({ where });
  }

  aggregate?(_pipeline: any[]): Promise<any> {
    throw new Error('PrismaModelProxy.aggregate not implemented');
  }
}
