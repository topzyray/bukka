import {
  FieldOp,
  FilterExpression,
  SortSpec,
} from 'src/DataLayer/Abstracts/Types/DatabaseTypes';

export class PrismaAdapterHelper {
  // Detect if an object is the FilterExpression shape or already a Prisma where object.
  static isFilterExpression(obj: any): boolean {
    if (!obj || typeof obj !== 'object') return false;
    if ('field' in obj && 'op' in obj) return true;
    if ('AND' in obj || 'OR' in obj || 'NOT' in obj) return true;
    return false;
  }

  /**
   * Convert your abstract FilterExpression or a mixed object into a Prisma `where` clause.
   * If the incoming `filter` already looks like a prisma-style where object, we mostly pass-through,
   * but still recursively convert any nested FilterExpression inside it.
   */
  static toPrismaWhere(filter?: FilterExpression | Record<string, any>): any {
    if (!filter) return undefined;

    // If array was accidentally passed, wrap as AND (defensive)
    if (Array.isArray(filter)) {
      // previously returned array directly (bug) — now return { AND: [...] }
      return { AND: (filter as any[]).map((f) => this.toPrismaWhere(f)) };
    }

    // If it's a FilterExpression (field/op/value or boolean composition)
    if (this.isFilterExpression(filter)) {
      // single field op
      if ('field' in filter && 'op' in filter) {
        const f = filter as any as { field: string; op: FieldOp; value: any };
        return this.convertFieldOp(f.field, f.op, f.value);
      }

      // AND / OR / NOT
      if ('AND' in filter) {
        return {
          AND: (filter as any).AND.map((f: any) => this.toPrismaWhere(f)),
        };
      }
      if ('OR' in filter) {
        return {
          OR: (filter as any).OR.map((f: any) => this.toPrismaWhere(f)),
        };
      }
      if ('NOT' in filter) {
        return {
          NOT: this.toPrismaWhere((filter as any).NOT),
        };
      }
    }

    // Otherwise assume it's a plain object that is already close to Prisma where.
    // But it may contain nested FilterExpressions — convert those recursively.
    const out: any = {};
    for (const k of Object.keys(filter as any)) {
      const v = (filter as any)[k];

      if (this.isFilterExpression(v)) {
        out[k] = this.toPrismaWhere(v);
      } else if (Array.isArray(v)) {
        // If nested array, map each element and wrap if needed
        out[k] = v.map((item) =>
          this.isFilterExpression(item) ? this.toPrismaWhere(item) : item,
        );
      } else if (v && typeof v === 'object') {
        // nested object (e.g., members: { some: { userId: 'x' } } or createdAt: { gt: date })
        const nested: any = {};
        for (const nk of Object.keys(v)) {
          const nv = v[nk];
          if (this.isFilterExpression(nv)) nested[nk] = this.toPrismaWhere(nv);
          else if (Array.isArray(nv))
            nested[nk] = nv.map((item) =>
              this.isFilterExpression(item) ? this.toPrismaWhere(item) : item,
            );
          else nested[nk] = nv;
        }
        out[k] = nested;
      } else {
        out[k] = v;
      }
    }

    return out;
  }

  // static toPrismaWhere(filter?: FilterExpression | Record<string, any>): any {
  //   if (!filter) return undefined;

  //   // If array, convert each entry
  //   if (Array.isArray(filter)) {
  //     return filter.map((f) => this.toPrismaWhere(f));
  //   }

  //   // If it's a FilterExpression (field/op/value or boolean composition)
  //   if (this.isFilterExpression(filter)) {
  //     // single field op
  //     if ('field' in filter && 'op' in filter) {
  //       const f = filter as any as { field: string; op: FieldOp; value: any };
  //       return this.convertFieldOp(f.field, f.op, f.value);
  //     }

  //     // AND / OR / NOT
  //     if ('AND' in filter) {
  //       return {
  //         AND: (filter as any).AND.map((f: any) => this.toPrismaWhere(f)),
  //       };
  //     }
  //     if ('OR' in filter) {
  //       return {
  //         OR: (filter as any).OR.map((f: any) => this.toPrismaWhere(f)),
  //       };
  //     }
  //     if ('NOT' in filter) {
  //       return {
  //         NOT: this.toPrismaWhere((filter as any).NOT),
  //       };
  //     }
  //   }

  //   // Otherwise assume it's a plain object that is already close to Prisma where.
  //   // But it may contain nested FilterExpressions — convert those recursively.
  //   const out: any = {};
  //   for (const k of Object.keys(filter as any)) {
  //     const v = (filter as any)[k];

  //     if (this.isFilterExpression(v)) {
  //       out[k] = this.toPrismaWhere(v);
  //     } else if (Array.isArray(v)) {
  //       out[k] = v.map((item) =>
  //         this.isFilterExpression(item) ? this.toPrismaWhere(item) : item,
  //       );
  //     } else if (v && typeof v === 'object') {
  //       // nested object (e.g., members: { some: { userId: 'x' } } or createdAt: { gt: date })
  //       const nested: any = {};
  //       for (const nk of Object.keys(v)) {
  //         const nv = v[nk];
  //         if (this.isFilterExpression(nv)) nested[nk] = this.toPrismaWhere(nv);
  //         else if (Array.isArray(nv))
  //           nested[nk] = nv.map((item) =>
  //             this.isFilterExpression(item) ? this.toPrismaWhere(item) : item,
  //           );
  //         else nested[nk] = nv;
  //       }
  //       out[k] = nested;
  //     } else {
  //       out[k] = v;
  //     }
  //   }

  //   return out;
  // }

  private static convertFieldOp(
    field: string,
    op: FieldOp,
    value: any,
  ): Record<string, any> {
    // helper for nested dot-path (e.g. 'author.name') -> nested object
    const buildNested = (fieldPath: string[], leaf: any) => {
      const out: any = {};
      let cur = out;
      for (let i = 0; i < fieldPath.length; i++) {
        const p = fieldPath[i];
        if (i === fieldPath.length - 1) {
          cur[p] = leaf;
        } else {
          cur[p] = cur[p] || {};
          cur = cur[p];
        }
      }
      return out;
    };

    const parts = field.split('.');

    const leaf = (() => {
      switch (op) {
        case 'eq':
          return value;
        case 'ne':
          return { not: value };
        case 'gt':
          return { gt: value };
        case 'gte':
          return { gte: value };
        case 'lt':
          return { lt: value };
        case 'lte':
          return { lte: value };
        case 'in':
          return { in: Array.isArray(value) ? value : [value] };
        case 'nin':
          return { notIn: Array.isArray(value) ? value : [value] };
        case 'contains': {
          // accept value as either string OR { value: string, mode?: 'insensitive' }
          if (
            value &&
            typeof value === 'object' &&
            Object.prototype.hasOwnProperty.call(value, 'value')
          ) {
            const v = (value as any).value;
            const mode = (value as any).mode;
            return mode ? { contains: v, mode } : { contains: v };
          }
          return { contains: value };
        }
        case 'startsWith':
          return { startsWith: value };
        case 'endsWith':
          return { endsWith: value };
        default:
          return value;
      }
    })();

    // if field is dotted path, produce nested object
    if (parts.length > 1) {
      return buildNested(parts, leaf);
    }

    return { [field]: leaf };
  }

  // private static convertFieldOp(
  //   field: string,
  //   op: FieldOp,
  //   value: any,
  // ): Record<string, any> {
  //   switch (op) {
  //     case 'eq':
  //       return { [field]: value };
  //     case 'ne':
  //       return { [field]: { not: value } };
  //     case 'gt':
  //       return { [field]: { gt: value } };
  //     case 'gte':
  //       return { [field]: { gte: value } };
  //     case 'lt':
  //       return { [field]: { lt: value } };
  //     case 'lte':
  //       return { [field]: { lte: value } };
  //     case 'in':
  //       return { [field]: { in: Array.isArray(value) ? value : [value] } };
  //     case 'nin':
  //       return {
  //         [field]: { notIn: Array.isArray(value) ? value : [value] },
  //       };
  //     case 'contains':
  //       return { [field]: { contains: value } };
  //     case 'startsWith':
  //       return { [field]: { startsWith: value } };
  //     case 'endsWith':
  //       return { [field]: { endsWith: value } };
  //     default:
  //       return { [field]: value };
  //   }
  // }

  static toPrismaOrderBy(sort?: SortSpec[]) {
    if (!sort || !Array.isArray(sort) || sort.length === 0) return undefined;
    return sort.map((s) => ({ [s.field]: (s.direction ?? 'asc') as any }));
  }

  /**
   * Build an `include` object for Prisma based on:
   *  - spec.relations: string[] (simple include),
   *  - OR extras.include (full Prisma include object) — extras.include wins.
   *
   * extras is the escape hatch for advanced nested includes (ordering/take/select within relations).
   */
  static toPrismaInclude(relations?: string[], extras?: any) {
    if (extras && extras.include) return extras.include;
    if (!relations || relations.length === 0) return undefined;
    const include: any = {};
    for (const r of relations) include[r] = true;
    return include;
  }
}
