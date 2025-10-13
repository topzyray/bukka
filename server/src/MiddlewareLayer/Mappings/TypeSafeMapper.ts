/**
 * TypeSafeMapper
 * ----------------------------------------------------------
 * A robust, type-safe data transformer for fine-grained control
 * over object serialization and shape mapping.
 *
 * ✅ Include or exclude fields dynamically
 * ✅ Alias (rename) fields (supports nested dot-paths)
 * ✅ Preserve nested objects and arrays
 * ✅ Optional ISO date serialization (serializeDates)
 * ✅ Works recursively and immutably
 *
 * 🧱 Ideal for DTO shaping, API response filtering, or internal mapping.
 */

type MapperOptions = {
  /**
   * Fields to include (whitelist) – supports dot notation
   * e.g. "profile.bio" or "address.city"
   */
  include?: string[];

  /**
   * Fields to exclude (blacklist) – supports dot notation
   * e.g. "password" or "profile.phone"
   */
  exclude?: string[];

  /**
   * Map of aliases to rename or restructure fields
   * Key = destination field path
   * Value = source field path
   *
   * e.g.
   * {
   *   fullName: "name",
   *   "meta.createdAt": "audit.createdAt",
   *   "profile.contact.phone": "contact.phoneNumber"
   * }
   */
  alias?: Record<string, string>;

  /**
   * Automatically serialize Date objects into ISO strings.
   * Defaults to false (Dates preserved as Date instances).
   */
  serializeDates?: boolean;
};

export class TypeSafeMapper {
  /**
   * Maps a single object according to mapping rules.
   *
   * @param source The source object
   * @param options Mapper configuration (include, exclude, alias, serializeDates)
   * @returns Transformed object
   *
   * 🧩 Example:
   * ```ts
   * const result = TypeSafeMapper.mapObject(user, {
   *   exclude: ['password'],
   *   alias: { 'meta.createdAt': 'audit.createdAt' },
   *   serializeDates: true
   * });
   * ```
   */
  static mapObject<Source extends object>(
    source: Source,
    options?: MapperOptions,
  ): Record<string, any> {
    if (!source || typeof source !== 'object') return {};

    const result: any = Array.isArray(source) ? [] : {};

    // 1️⃣ Apply aliases (with nested dot-path support)
    if (options?.alias) {
      for (const [destPath, sourcePath] of Object.entries(options.alias)) {
        const value = this.getValueByPath(source, sourcePath);
        if (value !== undefined) {
          this.setValueByPath(
            result,
            destPath,
            this.cloneValue(value, options),
          );
        }
      }
    }

    // 2️⃣ Traverse source properties
    for (const key in source) {
      if (
        options?.alias &&
        Object.values(options.alias).some((path) => path.split('.')[0] === key)
      )
        continue; // skip alias source keys already handled

      if (this.shouldSkipKey(key, options)) continue;

      const value = (source as any)[key];
      result[key] = this.cloneValue(value, options, key);
    }

    return result;
  }

  /**
   * Maps an array of objects using the same options.
   *
   * @param sources Array of source objects
   * @param options MapperOptions
   * @returns Transformed array
   *
   * 🧩 Example:
   * ```ts
   * const safeUsers = TypeSafeMapper.mapArray(users, {
   *   exclude: ['password'],
   *   serializeDates: true,
   * });
   * ```
   */
  static mapArray<Source extends object>(
    sources: Source[],
    options?: MapperOptions,
  ): Record<string, any>[] {
    return (sources ?? []).map((src) => this.mapObject(src, options));
  }

  // ======================================================
  // 🧠 INTERNAL HELPERS
  // ======================================================

  /** Should a given key be skipped based on include/exclude? */
  private static shouldSkipKey(key: string, options?: MapperOptions): boolean {
    const { include, exclude } = options || {};

    if (include?.length) {
      return !include.some((inc) => inc === key || inc.startsWith(`${key}.`));
    }

    if (exclude?.length) {
      return exclude.some((exc) => exc === key || exc.startsWith(`${key}.`));
    }

    return false; // No include/exclude rules — include all
  }

  /** Clone or transform a value recursively */
  private static cloneValue(value: any, options?: MapperOptions, key?: string) {
    // ✅ Handle null/undefined
    if (value === null || value === undefined) return value;

    // ✅ Handle Date serialization
    if (value instanceof Date) {
      return options?.serializeDates ? value.toISOString() : new Date(value);
    }

    // ✅ Handle arrays recursively
    if (Array.isArray(value)) {
      return value.map((v) =>
        typeof v === 'object'
          ? this.mapObject(v, this.nestedOptions(key, options))
          : v,
      );
    }

    // ✅ Handle nested objects
    if (typeof value === 'object') {
      return this.mapObject(value, this.nestedOptions(key, options));
    }

    // ✅ Primitive value
    return value;
  }

  /** Get nested value using dot notation */
  private static getValueByPath(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }

  /** Set nested value using dot notation (creates intermediate objects if needed) */
  private static setValueByPath(obj: any, path: string, value: any): void {
    const parts = path.split('.');
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {
      const key = parts[i];
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }

    current[parts[parts.length - 1]] = value;
  }

  /** Create child-level options for nested traversal */
  private static nestedOptions(
    parentKey?: string,
    options?: MapperOptions,
  ): MapperOptions {
    if (!options || !parentKey)
      return { serializeDates: options?.serializeDates };

    const makeNested = (keys?: string[]) =>
      keys
        ?.filter((k) => k.startsWith(`${parentKey}.`))
        .map((k) => k.replace(`${parentKey}.`, ''));

    const makeNestedAlias = (alias?: Record<string, string>) => {
      const nestedAlias: Record<string, string> = {};
      if (alias) {
        for (const [dest, path] of Object.entries(alias)) {
          if (path.startsWith(`${parentKey}.`)) {
            nestedAlias[dest] = path.replace(`${parentKey}.`, '');
          }
        }
      }
      return nestedAlias;
    };

    return {
      include: makeNested(options.include),
      exclude: makeNested(options.exclude),
      alias: makeNestedAlias(options.alias),
      serializeDates: options.serializeDates,
    };
  }
}
