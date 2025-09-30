import { PrismaService } from 'src/InfrastructureLayer/Services/PrismaService';
import { DatabaseConstant } from './../../DomainLayer/Constants/DatabaseConstant';
import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { PrismaAdapter } from 'src/DataLayer/Adapters/Prisma/PrismaAdapter';
import { DbAdapterEnum } from 'src/DomainLayer/Enums/DbAdapterEnum';
import { AppConfigurationService } from './AppConfiguration.service';

@Global()
@Module({})
export class DatabaseModule {
  private static readonly logger = new Logger(DatabaseModule.name);

  static forRoot(opts: { adapter?: DbAdapterEnum.PRISMA }): DynamicModule {
    this.logger.log(`Database Adapter: ${opts?.adapter?.toUpperCase()}`);
    const adapterProvider = {
      provide: DatabaseConstant.DATABASE_ADAPTER,
      useClass: PrismaAdapter,
    };
    return {
      module: DatabaseModule,
      providers: [PrismaService, AppConfigurationService, adapterProvider],
      exports: [PrismaService, adapterProvider],
    };
  }
}
