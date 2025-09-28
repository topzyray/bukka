import { PrismaService } from 'src/InfrastructureLayer/Services/PrismaService';
import { DatabaseConstant } from './../../DomainLayer/Constants/DatabaseConstant';
import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { PrismaAdapter } from 'src/DataLayer/Adapters/Prisma/PrismaAdapter';

@Global()
@Module({})
export class DatabaseModule {
  private static readonly logger = new Logger(DatabaseModule.name);

  static forRoot(opts: { adapter?: 'prisma' }): DynamicModule {
    this.logger.log(`Database Adapter: ${opts?.adapter?.toUpperCase()}`);
    const adapterProvider = {
      provide: DatabaseConstant.DATABASE_ADAPTER,
      useClass: PrismaAdapter,
    };
    return {
      module: DatabaseModule,
      providers: [PrismaService, adapterProvider],
      exports: [PrismaService, adapterProvider],
    };
  }
}
