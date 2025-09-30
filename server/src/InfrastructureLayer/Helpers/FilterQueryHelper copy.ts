import { FilterExpression } from 'src/DataLayer/Abstracts/Types/DatabaseTypes';

interface FilterRule {
  field: string;
  dtoKey?: string; // if different from field
  transform?: (value: any) => any;
  skipUndefined?: boolean; // default true
}

interface BuildQueryOptions {
  dto: any;
  rules: FilterRule[];
  searchConfig?: {
    fields: string[];
    mode?: 'default' | 'insensitive';
  };
}

export class FilterQueryHelper {
  /**
   * Return type: FilterExpression | {} (empty)
   * - If multiple exact-match rules are present they are combined with AND
   * - If search is present across N fields, it is represented as OR of contains expressions
   * - If both are present, result is { AND: [ ...exactMatches, { OR: [...] } ] }
   */
  static buildQuery({
    dto,
    rules,
    searchConfig,
  }: BuildQueryOptions): FilterExpression | Record<string, any> {
    const exactExprs: FilterExpression[] = [];

    // build field-level expressions (field/op/value)
    for (const rule of rules) {
      const key = rule.dtoKey ?? rule.field;
      const value = dto[key];

      if (
        (value === undefined || value === null) &&
        rule.skipUndefined !== false
      ) {
        continue;
      }

      const transformed = rule.transform ? rule.transform(value) : value;
      exactExprs.push({ field: rule.field, op: 'eq', value: transformed });
    }

    // build search expression as an OR of 'contains' FilterExpression(s)
    let searchExpr: FilterExpression | null = null;
    if (searchConfig && typeof dto.search === 'string' && dto.search.trim()) {
      const q = dto.search.trim();
      const orExprs: FilterExpression[] = searchConfig.fields.map((f) => {
        // we keep mode in the value so the adapter can interpret it (e.g. Prisma mode)
        if (searchConfig.mode === 'insensitive') {
          return {
            field: f,
            op: 'contains',
            value: { value: q, mode: 'insensitive' } as any,
          };
        }
        return { field: f, op: 'contains', value: q } as FilterExpression;
      });
      searchExpr =
        orExprs.length === 1
          ? orExprs[0]
          : ({ OR: orExprs } as FilterExpression);
    }

    // combine
    if (exactExprs.length > 0 && searchExpr) {
      const parts: FilterExpression[] = [...exactExprs, searchExpr];
      return parts.length === 1
        ? parts[0]
        : ({ AND: parts } as FilterExpression);
    } else if (exactExprs.length > 0) {
      return exactExprs.length === 1
        ? exactExprs[0]
        : ({ AND: exactExprs } as FilterExpression);
    } else if (searchExpr) {
      return searchExpr;
    } else {
      return {}; // empty filter
    }
  }

  static extractPagination(dto: any) {
    let pageSize = Number(dto.pageSize) || 10;
    let pageNumber = Number(dto.pageNumber) || 1;

    pageSize = Math.max(1, pageSize);
    pageNumber = Math.max(1, pageNumber);

    return { pageSize, pageNumber };
  }

  /**
   * Merge an existing FilterExpression OR plain where-object with an extra FilterExpression.
   * Always returns a FilterExpression or plain-object in a single merged structure (no arrays).
   *
   * filter: may be:
   *  - {} (empty)
   *  - a FilterExpression (field/op/value or AND/OR/NOT)
   *  - a plain object that looks like a "where" (e.g. nested relations) — we will wrap it under AND
   *
   * extraCondition: a FilterExpression (usually { field: 'isDeleted', op:'eq', value:false }).
   */
  static mergeFilterWithCondition(
    filter: any,
    extraCondition: FilterExpression | any,
  ): FilterExpression | Record<string, any> {
    // empty -> return extra
    if (
      !filter ||
      (typeof filter === 'object' && Object.keys(filter).length === 0)
    ) {
      return extraCondition;
    }

    // If incoming is a FilterExpression single-field (field/op/value)
    if (typeof filter === 'object' && ('field' in filter || 'op' in filter)) {
      // avoid duplicate if same field present
      if (
        (filter as any).field &&
        (extraCondition as any).field &&
        (filter as any).field === (extraCondition as any).field
      ) {
        return filter;
      }
      return { AND: [filter, extraCondition] } as FilterExpression;
    }

    // If incoming already has AND
    if (filter.AND && Array.isArray(filter.AND)) {
      // avoid duplicate isDeleted if extraCondition is isDeleted and already present
      if ((extraCondition as any).field === 'isDeleted') {
        const already = filter.AND.some((f: any) => {
          if (!f) return false;
          if (typeof f === 'object' && 'field' in f)
            return f.field === 'isDeleted';
          if (
            typeof f === 'object' &&
            Object.prototype.hasOwnProperty.call(f, 'isDeleted')
          )
            return true;
          return false;
        });
        if (already) return filter;
      }
      return { AND: [...filter.AND, extraCondition] } as FilterExpression;
    }

    // If incoming is a plain object that already includes isDeleted at top-level, keep it
    if (Object.prototype.hasOwnProperty.call(filter, 'isDeleted')) {
      return filter;
    }

    // If incoming has OR or NOT -> wrap in AND with extraCondition so semantics are preserved
    if (filter.OR || filter.NOT) {
      return { AND: [filter, extraCondition] } as FilterExpression;
    }

    // Default: wrap plain object under AND with extra condition
    return { AND: [filter, extraCondition] } as FilterExpression;
  }
}

// interface FilterRule {
//   field: string;
//   dtoKey?: string; // if different from field
//   transform?: (value: any) => any;
//   skipUndefined?: boolean; // default true
// }

// interface BuildQueryOptions {
//   dto: any;
//   rules: FilterRule[];
//   searchConfig?: {
//     fields: string[];
//     mode?: 'default' | 'insensitive';
//   };
// }

// export class FilterQueryHelper {
//   static buildQuery({ dto, rules, searchConfig }: BuildQueryOptions): any {
//     const filters: any[] = [];

//     for (const rule of rules) {
//       const key = rule.dtoKey ?? rule.field;
//       const value = dto[key];

//       if (
//         (value === undefined || value === null) &&
//         rule.skipUndefined !== false
//       ) {
//         continue;
//       }

//       filters.push({
//         [rule.field]: rule.transform ? rule.transform(value) : value,
//       });
//     }

//     const searchConditions: any[] = [];
//     if (searchConfig && typeof dto.search === 'string' && dto.search.trim()) {
//       for (const field of searchConfig.fields) {
//         searchConditions.push({
//           [field]: {
//             contains: dto.search.trim(),
//             mode: searchConfig.mode ?? 'default',
//           },
//         });
//       }
//     }

//     // combine filters and search
//     if (filters.length && searchConditions.length) {
//       return { AND: [...filters, { OR: searchConditions }] };
//     } else if (filters.length) {
//       return filters.length === 1 ? filters[0] : { AND: filters };
//     } else if (searchConditions.length) {
//       return { OR: searchConditions };
//     } else {
//       return {};
//     }
//   }

//   static extractPagination(dto: any) {
//     let pageSize = Number(dto.pageSize) || 10;
//     let pageNumber = Number(dto.pageNumber) || 1;

//     pageSize = Math.max(1, pageSize);
//     pageNumber = Math.max(1, pageNumber);

//     return { pageSize, pageNumber };
//   }

//   /**
//    * Merge an incoming filter (many possible shapes) with an extra condition (prisma-style or FilterExpression).
//    * Returns a single filter object safe to pass to model.count/find/update/etc.
//    */
//   static mergeFilterWithCondition(filter: any, extraCondition: any): any {
//     // empty incoming filter -> return extra directly
//     if (
//       !filter ||
//       (typeof filter === 'object' && Object.keys(filter).length === 0)
//     ) {
//       return extraCondition;
//     }

//     // if incoming is a FilterExpression single field like { field, op, value }
//     if (typeof filter === 'object' && ('field' in filter || 'op' in filter)) {
//       // don't duplicate if the extraCondition is same as filter
//       if (filter.field === extraCondition.field) return filter;
//       return { AND: [filter, extraCondition] };
//     }

//     // if incoming already has AND array
//     if (filter.AND && Array.isArray(filter.AND)) {
//       // avoid inserting duplicate isDeleted if present
//       const hasIsDeletedInAnd = filter.AND.some(
//         (f: any) =>
//           f &&
//           typeof f === 'object' &&
//           (f.isDeleted !== undefined || f.field === 'isDeleted'),
//       );
//       if (hasIsDeletedInAnd) return filter;
//       return { AND: [...filter.AND, extraCondition] };
//     }

//     // if incoming already contains top-level isDeleted (prisma style)
//     if (Object.prototype.hasOwnProperty.call(filter, 'isDeleted')) {
//       return filter;
//     }

//     // if incoming has OR/NOT or any nested structure, wrap with AND to combine safely
//     if (filter.OR || filter.NOT) {
//       return { AND: [filter, extraCondition] };
//     }

//     // default: plain object like { id: 1 } or nested object -> combine under AND
//     return { AND: [filter, extraCondition] };
//   }
// }
