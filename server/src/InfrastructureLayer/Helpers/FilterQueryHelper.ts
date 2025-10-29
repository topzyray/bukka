import {
  FilterExpression,
  FieldOp,
} from 'src/DataLayer/Abstracts/Types/DatabaseTypes';

interface FilterRule {
  field: string;
  dtoKey?: string; // if different from field
  transform?: (value: any) => any;
  skipUndefined?: boolean; // default true
  defaultOp?: FieldOp; // NEW: allows flexible operators like 'has', 'in', 'contains', etc.
}

interface SearchField {
  field: string;
  dtoKey?: string;
  defaultOp?: FieldOp;
}

interface BuildQueryOptions {
  dto: any;
  rules: FilterRule[];
  searchConfig?: {
    fields: (string | SearchField)[];
    mode?: 'default' | 'insensitive';
  };
}

export class FilterQueryHelper {
  /**
   * Builds a FilterExpression from DTO + rules + search configuration.
   * Keeps full backward compatibility while supporting flexible ops (e.g. cuisines uses 'has').
   */
  static buildQuery({
    dto,
    rules,
    searchConfig,
  }: BuildQueryOptions): FilterExpression | Record<string, any> {
    const exactExprs: FilterExpression[] = [];

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
      const op: FieldOp = (rule.defaultOp ?? 'eq') as FieldOp;

      // ✅ Allow transform() to return one or many expressions
      const expressions: FilterExpression[] = Array.isArray(transformed)
        ? transformed.map((t) =>
            typeof t === 'object' && 'field' in t && 'op' in t
              ? (t as FilterExpression)
              : { field: rule.field, op, value: t },
          )
        : [{ field: rule.field, op, value: transformed }];

      exactExprs.push(...expressions);
    }

    // build search expression (same as before)
    let searchExpr: FilterExpression | null = null;
    if (searchConfig && typeof dto.search === 'string' && dto.search.trim()) {
      const q = dto.search.trim();
      const orExprs: FilterExpression[] = searchConfig.fields.map((f) => {
        const fieldConfig = typeof f === 'string' ? { field: f } : f;
        const searchValue = dto.search.trim();

        const op: FieldOp = fieldConfig.defaultOp ?? 'contains';

        return {
          field: fieldConfig.field,
          op,
          value:
            op === 'contains' && searchConfig.mode === 'insensitive'
              ? { value: searchValue, mode: 'insensitive' }
              : searchValue,
        };
      });
      searchExpr =
        orExprs.length === 1
          ? orExprs[0]
          : ({ OR: orExprs } as FilterExpression);
    }

    // combine logic unchanged
    if (exactExprs.length > 0 && searchExpr) {
      return { AND: [...exactExprs, searchExpr] } as FilterExpression;
    } else if (exactExprs.length > 0) {
      return exactExprs.length === 1
        ? exactExprs[0]
        : ({ AND: exactExprs } as FilterExpression);
    } else if (searchExpr) {
      return searchExpr;
    } else {
      return {};
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
   * Merge an existing FilterExpression or plain where-object with an extra FilterExpression.
   */
  static mergeFilterWithCondition(
    filter: any,
    extraCondition: FilterExpression | any,
  ): FilterExpression | Record<string, any> {
    if (
      !filter ||
      (typeof filter === 'object' && Object.keys(filter).length === 0)
    ) {
      return extraCondition;
    }

    if (typeof filter === 'object' && ('field' in filter || 'op' in filter)) {
      if (
        (filter as any).field &&
        (extraCondition as any).field &&
        (filter as any).field === (extraCondition as any).field
      ) {
        return filter;
      }
      return { AND: [filter, extraCondition] } as FilterExpression;
    }

    if (filter.AND && Array.isArray(filter.AND)) {
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

    if (Object.prototype.hasOwnProperty.call(filter, 'isDeleted')) {
      return filter;
    }

    if (filter.OR || filter.NOT) {
      return { AND: [filter, extraCondition] } as FilterExpression;
    }

    return { AND: [filter, extraCondition] } as FilterExpression;
  }
}

/*
  Use case of buildQuery

  CASE 1: Simple Equality Filters
  const dto = {
    city: 'New York',
    isActive: true,
  };

  const query = FilterQueryHelper.buildQuery({
    dto,
    rules: [
      { field: 'city' },
      { field: 'isActive' },
    ],
  });

  console.log(query);

  {
    AND: [
      { field: 'city', op: 'eq', value: 'New York' },
      { field: 'isActive', op: 'eq', value: true }
    ]
  }

  CASE 2: Filter by Array Fields (e.g. cuisines)
  const dto = { cuisine: 'Italian' };

  const query = FilterQueryHelper.buildQuery({
    dto,
    rules: [
      { field: 'cuisines', dtoKey: 'cuisine', defaultOp: 'has' },
    ],
  });

  { field: 'cuisines', op: 'has', value: 'Italian' }

  CASE 3: Filter with a Custom Transform (e.g. Map UI selection → Enum)
  const dto = { open_now: true };

  const query = FilterQueryHelper.buildQuery({
    dto,
    rules: [
      {
        field: 'openingHours',
        dtoKey: 'open_now',
        transform: (value) => {
          if (value) {
            const now = new Date().toISOString();
            return { field: 'closingTime', op: 'gte', value: now };
          }
          return undefined;
        },
      },
    ],
  });

  { field: 'closingTime', op: 'gte', value: '2025-10-28T12:30:00Z' }


  CASE 4: Date Range Filters (startDate + endDate)
  const dto = {
    startDate: '2025-10-01',
    endDate: '2025-10-31',
  };

  const query = FilterQueryHelper.buildQuery({
    dto,
    rules: [
      {
        field: 'createdAt',
        transform: (_v, allDto = dto) => {
          const exprs: FilterExpression[] = [];
          if (allDto.startDate)
            exprs.push({ field: 'createdAt', op: 'gte', value: allDto.startDate });
          if (allDto.endDate)
            exprs.push({ field: 'createdAt', op: 'lte', value: allDto.endDate });
          return exprs;
        },
      },
    ],
  });

  {
    AND: [
      { field: 'createdAt', op: 'gte', value: '2025-10-01' },
      { field: 'createdAt', op: 'lte', value: '2025-10-31' },
    ]
  }


  CASE 5: Search Across Multiple Fields
  const dto = { search: 'pizza' };

  const query = FilterQueryHelper.buildQuery({
    dto,
    rules: [], // no specific rules, just search
    searchConfig: {
      fields: ['name', 'description', 'cuisines'],
      mode: 'insensitive', // optional
    },
  });

  {
    OR: [
      { field: 'name', op: 'contains', value: { value: 'pizza', mode: 'insensitive' } },
      { field: 'description', op: 'contains', value: { value: 'pizza', mode: 'insensitive' } },
      { field: 'cuisines', op: 'contains', value: { value: 'pizza', mode: 'insensitive' } },
    ]
  }


  CASE 6: Combine Filters and Search
  const dto = {
    city: 'New York',
    isActive: true,
    search: 'pizza',
  };

  const query = FilterQueryHelper.buildQuery({
    dto,
    rules: [
      { field: 'city' },
      { field: 'isActive' },
    ],
    searchConfig: {
      fields: ['name', 'description', 'cuisines'],
      mode: 'insensitive',
    },
  });

  {
    AND: [
      { field: 'city', op: 'eq', value: 'New York' },
      { field: 'isActive', op: 'eq', value: true },
      {
        OR: [
          { field: 'name', op: 'contains', value: { value: 'pizza', mode: 'insensitive' } },
          { field: 'description', op: 'contains', value: { value: 'pizza', mode: 'insensitive' } },
          { field: 'cuisines', op: 'contains', value: { value: 'pizza', mode: 'insensitive' } }
        ]
      }
    ]
  }

  CASE 7: In-Operator (e.g. multiple statuses)
  const dto = { statuses: ['OPEN', 'BUSY'] };

  const query = FilterQueryHelper.buildQuery({
    dto,
    rules: [
      { field: 'status', dtoKey: 'statuses', defaultOp: 'in' },
    ],
  });

  { field: 'status', op: 'in', value: ['OPEN', 'BUSY'] }


| Use Case             | Example Operator       | Config             |
| -------------------- | ---------------------- | ------------------ |
| Simple filters       | `eq`                   | default            |
| Search (text)        | `contains`             | via `searchConfig` |
| Array fields         | `has`, `hasSome`, etc. | via `defaultOp`    |
| Multi-value filters  | `in`                   | via `defaultOp`    |
| Date range           | `gte` + `lte`          | via `transform()`  |
| Complex custom logic | any                    | via `transform()`  |



  */

// import { FilterExpression } from 'src/DataLayer/Abstracts/Types/DatabaseTypes';

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
//   /**
//    * Return type: FilterExpression | {} (empty)
//    * - If multiple exact-match rules are present they are combined with AND
//    * - If search is present across N fields, it is represented as OR of contains expressions
//    * - If both are present, result is { AND: [ ...exactMatches, { OR: [...] } ] }
//    */
//   static buildQuery({
//     dto,
//     rules,
//     searchConfig,
//   }: BuildQueryOptions): FilterExpression | Record<string, any> {
//     const exactExprs: FilterExpression[] = [];

//     // build field-level expressions (field/op/value)
//     for (const rule of rules) {
//       const key = rule.dtoKey ?? rule.field;
//       const value = dto[key];

//       if (
//         (value === undefined || value === null) &&
//         rule.skipUndefined !== false
//       ) {
//         continue;
//       }

//       const transformed = rule.transform ? rule.transform(value) : value;
//       exactExprs.push({ field: rule.field, op: 'eq', value: transformed });
//     }

//     // build search expression as an OR of 'contains' FilterExpression(s)
//     let searchExpr: FilterExpression | null = null;
//     if (searchConfig && typeof dto.search === 'string' && dto.search.trim()) {
//       const q = dto.search.trim();
//       const orExprs: FilterExpression[] = searchConfig.fields.map((f) => {
//         // we keep mode in the value so the adapter can interpret it (e.g. Prisma mode)
//         if (searchConfig.mode === 'insensitive') {
//           return {
//             field: f,
//             op: 'contains',
//             value: { value: q, mode: 'insensitive' } as any,
//           };
//         }
//         return { field: f, op: 'contains', value: q } as FilterExpression;
//       });
//       searchExpr =
//         orExprs.length === 1
//           ? orExprs[0]
//           : ({ OR: orExprs } as FilterExpression);
//     }

//     // combine
//     if (exactExprs.length > 0 && searchExpr) {
//       const parts: FilterExpression[] = [...exactExprs, searchExpr];
//       return parts.length === 1
//         ? parts[0]
//         : ({ AND: parts } as FilterExpression);
//     } else if (exactExprs.length > 0) {
//       return exactExprs.length === 1
//         ? exactExprs[0]
//         : ({ AND: exactExprs } as FilterExpression);
//     } else if (searchExpr) {
//       return searchExpr;
//     } else {
//       return {}; // empty filter
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
//    * Merge an existing FilterExpression OR plain where-object with an extra FilterExpression.
//    * Always returns a FilterExpression or plain-object in a single merged structure (no arrays).
//    *
//    * filter: may be:
//    *  - {} (empty)
//    *  - a FilterExpression (field/op/value or AND/OR/NOT)
//    *  - a plain object that looks like a "where" (e.g. nested relations) — we will wrap it under AND
//    *
//    * extraCondition: a FilterExpression (usually { field: 'isDeleted', op:'eq', value:false }).
//    */
//   static mergeFilterWithCondition(
//     filter: any,
//     extraCondition: FilterExpression | any,
//   ): FilterExpression | Record<string, any> {
//     // empty -> return extra
//     if (
//       !filter ||
//       (typeof filter === 'object' && Object.keys(filter).length === 0)
//     ) {
//       return extraCondition;
//     }

//     // If incoming is a FilterExpression single-field (field/op/value)
//     if (typeof filter === 'object' && ('field' in filter || 'op' in filter)) {
//       // avoid duplicate if same field present
//       if (
//         (filter as any).field &&
//         (extraCondition as any).field &&
//         (filter as any).field === (extraCondition as any).field
//       ) {
//         return filter;
//       }
//       return { AND: [filter, extraCondition] } as FilterExpression;
//     }

//     // If incoming already has AND
//     if (filter.AND && Array.isArray(filter.AND)) {
//       // avoid duplicate isDeleted if extraCondition is isDeleted and already present
//       if ((extraCondition as any).field === 'isDeleted') {
//         const already = filter.AND.some((f: any) => {
//           if (!f) return false;
//           if (typeof f === 'object' && 'field' in f)
//             return f.field === 'isDeleted';
//           if (
//             typeof f === 'object' &&
//             Object.prototype.hasOwnProperty.call(f, 'isDeleted')
//           )
//             return true;
//           return false;
//         });
//         if (already) return filter;
//       }
//       return { AND: [...filter.AND, extraCondition] } as FilterExpression;
//     }

//     // If incoming is a plain object that already includes isDeleted at top-level, keep it
//     if (Object.prototype.hasOwnProperty.call(filter, 'isDeleted')) {
//       return filter;
//     }

//     // If incoming has OR or NOT -> wrap in AND with extraCondition so semantics are preserved
//     if (filter.OR || filter.NOT) {
//       return { AND: [filter, extraCondition] } as FilterExpression;
//     }

//     // Default: wrap plain object under AND with extra condition
//     return { AND: [filter, extraCondition] } as FilterExpression;
//   }
// }
