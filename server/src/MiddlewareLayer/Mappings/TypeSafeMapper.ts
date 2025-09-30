type MapperFunction<Source, TargetProp> = (source: Source) => TargetProp;

type MappingConfig<Source, Target> = {
  [K in keyof Target]:
    | (K extends keyof Source ? keyof Source : never)
    | MapperFunction<Source, Target[K]>
    | (Target[K] extends object
        ? MappingConfig<any, Target[K]> // only allow nested mapping for objects
        : never);
};

export class TypeSafeMapper {
  /**
   * Core object mapping function (config-driven)
   */
  static mapObject<Source, Target extends object>(
    source: Source,
    config: MappingConfig<Source, Target>,
  ): Target {
    const result = {} as Target;

    for (const key in config) {
      const mapping = config[key];

      if (typeof mapping === 'string') {
        // direct property mapping
        result[key] = (source as any)[mapping];
      } else if (typeof mapping === 'function') {
        // computed mapping
        result[key] = (mapping as MapperFunction<Source, Target[typeof key]>)(
          source,
        );
      } else if (typeof mapping === 'object' && mapping !== null) {
        // nested object mapping
        result[key] = TypeSafeMapper.mapObject(
          (source as any)[key] ?? {}, // avoid undefined crash
          mapping as MappingConfig<any, any>,
        );
      }
    }

    return result;
  }

  /**
   * Map an array of objects (config-driven)
   */
  static mapArray<Source, Target extends object>(
    sources: Source[],
    config: MappingConfig<Source, Target>,
  ): Target[] {
    return sources.map((item) => TypeSafeMapper.mapObject(item, config));
  }

  /**
   * Automapper-style map using TargetClass
   */
  static map<Source extends object, Target extends object>(
    source: Source,
    TargetClass: new () => Target,
    SourceClass?: new () => Source,
    config?: MappingConfig<Source, Target>,
  ): Target {
    if (config) {
      return TypeSafeMapper.mapObject(source, config);
    }

    const target: Target = new TargetClass();

    const sourceKeys = SourceClass
      ? Object.keys(new SourceClass())
      : Object.keys(source);

    for (const key of sourceKeys) {
      if (key in target) {
        (target as any)[key] = (source as any)[key];
      }
    }

    return target;
  }

  /**
   * Automapper-style mapArray using TargetClass
   */
  static mapArrayToClass<Source extends object, Target extends object>(
    sources: Source[],
    TargetClass: new () => Target,
    config?: MappingConfig<Source, Target>,
  ): Target[] {
    return sources.map((src) =>
      TypeSafeMapper.map(src, TargetClass, undefined, config),
    );
  }
}
