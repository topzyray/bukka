import { Injectable } from '@nestjs/common';
import { IDatabaseAdapter, ModelProxy } from '../DatabaseAdapter';
import { PrismaModelProxy } from './PrismaModelProxy';
import { PrismaService } from 'src/InfrastructureLayer/Services/PrismaService';

@Injectable()
export class PrismaAdapter implements IDatabaseAdapter {
  constructor(private readonly prisma: PrismaService) {}

  async connect() {
    // PrismaService handles connect in onModuleInit; no-op here
  }

  getModel<T = any>(name: string): ModelProxy<T> {
    const delegate = (this.prisma as any)[name];
    if (!delegate) throw new Error(`Prisma model delegate "${name}" not found`);
    return new PrismaModelProxy<T>(delegate);
  }

  async transaction<R>(
    fn: (txAdapter: IDatabaseAdapter) => Promise<R>,
  ): Promise<R> {
    return this.prisma.$transaction(async (tx: any) => {
      const txAdapter: IDatabaseAdapter = {
        getModel: <T = any>(nm: string) => new PrismaModelProxy<T>(tx[nm]),
        transaction: async (innerFn) => innerFn(txAdapter),
        raw: async (q: string, params?: any[]) =>
          tx.$queryRawUnsafe(q, ...(params || [])),
      } as IDatabaseAdapter;
      return fn(txAdapter);
    });
  }

  raw(q: string, params?: any[]) {
    return this.prisma.$queryRawUnsafe(q, ...(params || []));
  }

  close() {
    return this.prisma.$disconnect();
  }
}
