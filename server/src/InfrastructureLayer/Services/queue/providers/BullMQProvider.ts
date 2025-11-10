import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { Queue, Worker, Job } from 'bullmq';
import { RedisService } from 'src/InfrastructureLayer/Services/redis/RedisService';
import {
  IQueueProvider,
  QueueEnvelope,
  SendOptions,
  SubscribeOptions,
  SubscriptionHandle,
} from 'src/DataLayer/Abstracts/Interfaces/IQueueProvider';

@Injectable()
export class BullMQProvider
  implements IQueueProvider, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(BullMQProvider.name);
  private readonly redisConnection: any;
  private readonly prefix = 'bull'; // make queue namespace consistent
  private queues = new Map<string, Queue>();
  private workers = new Map<string, Worker>();

  constructor() {
    const redisService = RedisService.getInstance();
    this.redisConnection = redisService.getBullConnection();
  }

  async onModuleInit() {
    try {
      await this.redisConnection.ping();
      this.logger.log('BullMQ → Connected to Redis successfully at startup.');
    } catch (err) {
      this.logger.error('BullMQ → Failed to connect to Redis at startup', err);
    }
  }

  private async getOrCreateQueue(queueName: string): Promise<Queue> {
    if (!this.queues.has(queueName)) {
      const queue = new Queue(queueName, {
        connection: this.redisConnection,
        prefix: this.prefix,
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: false,
        },
      });
      this.queues.set(queueName, queue);
      this.logger.log(`BullMQ queue ready: ${queueName}`);
    }
    return this.queues.get(queueName)!;
  }

  async publish<T>(
    queueName: string,
    message: QueueEnvelope<T>,
    opts?: SendOptions,
  ): Promise<void> {
    const queue = await this.getOrCreateQueue(queueName);
    await queue.add(message.messageType, message, {
      jobId: opts?.messageId,
      attempts: opts?.retry ?? 3,
      delay: opts?.timeoutMs ?? 0,
      backoff: { type: 'exponential', delay: 1000 },
    });
    this.logger.debug(
      `BullMQ → Published ${message.messageType} to ${queueName} with payload: ${JSON.stringify(message.payload)}`,
    );
  }

  async consume(
    queueName: string,
    handler: (message: QueueEnvelope<any>) => Promise<void>,
    options?: SubscribeOptions,
  ): Promise<SubscriptionHandle> {
    if (this.workers.has(queueName)) {
      this.logger.warn(`Worker already exists for queue=${queueName}`);
      return { close: async () => this.closeWorker(queueName) };
    }

    // Ensure queue exists first
    await this.getOrCreateQueue(queueName);

    const worker = new Worker(
      queueName,
      async (job: Job) => {
        const envelope = job.data as QueueEnvelope;
        try {
          await handler(envelope);
        } catch (err) {
          this.logger.error(
            `BullMQ handler failed for queue=${queueName}, jobId=${job.id}`,
            err,
          );
          throw err;
        }
      },
      {
        connection: this.redisConnection,
        prefix: this.prefix,
        concurrency: options?.maxConcurrentCalls ?? 5,
      },
    );

    // Event listeners
    worker.on('ready', () =>
      this.logger.log(
        `BullMQ worker ready and listening on queue=${queueName}`,
      ),
    );

    worker.on('completed', (job) =>
      this.logger.debug(`BullMQ → Completed job ${job.id} (${job.name})`),
    );

    worker.on('failed', (job, err) =>
      this.logger.error(`BullMQ → Failed job ${job?.id}`, err),
    );

    worker.on('stalled', (job: Job | string) => {
      const jobId = typeof job === 'string' ? job : job?.id;
      this.logger.warn(`BullMQ → Job stalled: ${jobId} on queue=${queueName}`);
    });

    worker.on('error', (err) =>
      this.logger.error(`BullMQ Worker error on queue=${queueName}`, err),
    );

    this.workers.set(queueName, worker);
    this.logger.log(`Subscribed BullMQ worker to queue=${queueName}`);

    return { close: async () => this.closeWorker(queueName) };
  }

  private async closeWorker(queueName: string) {
    const worker = this.workers.get(queueName);
    if (worker) {
      await worker.close();
      this.workers.delete(queueName);
      this.logger.log(`BullMQ worker closed for queue=${queueName}`);
    }
  }

  async onModuleDestroy() {
    await this.close();
  }

  async close(): Promise<void> {
    for (const worker of this.workers.values()) await worker.close();
    for (const queue of this.queues.values()) await queue.close();
    this.logger.log('BullMQProvider closed.');
  }
}

// import {
//   Injectable,
//   Logger,
//   OnModuleInit,
//   OnModuleDestroy,
// } from '@nestjs/common';
// import { Queue, Worker, Job } from 'bullmq';
// import { RedisService } from 'src/InfrastructureLayer/Services/redis/RedisService';
// import {
//   IQueueProvider,
//   QueueEnvelope,
//   SendOptions,
//   SubscribeOptions,
//   SubscriptionHandle,
// } from 'src/DataLayer/Abstracts/Interfaces/IQueueProvider';

// @Injectable()
// export class BullMQProvider
//   implements IQueueProvider, OnModuleInit, OnModuleDestroy
// {
//   private readonly logger = new Logger(BullMQProvider.name);
//   private readonly redisConnection: any;
//   private queues = new Map<string, Queue>();
//   private workers = new Map<string, Worker>();

//   constructor() {
//     const redisService = RedisService.getInstance();
//     this.redisConnection = redisService.getBullConnection();
//   }

//   /** Ensure Redis is connected at module init */
//   async onModuleInit() {
//     try {
//       await this.redisConnection.ping();
//       this.logger.log('BullMQ → Connected to Redis successfully at startup.');
//     } catch (err) {
//       this.logger.error('BullMQ → Failed to connect to Redis at startup', err);
//     }
//   }

//   private async getOrCreateQueue(queueName: string): Promise<Queue> {
//     if (!this.queues.has(queueName)) {
//       const queue = new Queue(queueName, {
//         connection: this.redisConnection,
//         defaultJobOptions: {
//           removeOnComplete: true,
//           removeOnFail: false,
//         },
//       });
//       this.queues.set(queueName, queue);
//       this.logger.log(`BullMQ queue ready: ${queueName}`);
//     }
//     return this.queues.get(queueName)!;
//   }

//   async publish<T>(
//     queueName: string,
//     message: QueueEnvelope<T>,
//     opts?: SendOptions,
//   ): Promise<void> {
//     const queue = await this.getOrCreateQueue(queueName);
//     await queue.add(message.messageType, message, {
//       jobId: opts?.messageId,
//       attempts: opts?.retry ?? 3,
//       delay: opts?.timeoutMs ?? 0,
//       backoff: { type: 'exponential', delay: 1000 },
//     });
//     this.logger.debug(
//       `BullMQ → Published ${message.messageType} to ${queueName} with payload: ${JSON.stringify(message.payload)}`,
//     );
//   }

//   async consume(
//     queueName: string,
//     handler: (message: QueueEnvelope<any>) => Promise<void>,
//     options?: SubscribeOptions,
//   ): Promise<SubscriptionHandle> {
//     if (this.workers.has(queueName)) {
//       this.logger.warn(`Worker already exists for queue=${queueName}`);
//       return { close: async () => this.closeWorker(queueName) };
//     }

//     // Create worker
//     const worker = new Worker(
//       queueName,
//       async (job: Job) => {
//         const envelope = job.data as QueueEnvelope;
//         try {
//           await handler(envelope);
//         } catch (err) {
//           this.logger.error(
//             `BullMQ handler failed for queue=${queueName}`,
//             err,
//           );
//           throw err;
//         }
//       },
//       {
//         concurrency: options?.maxConcurrentCalls ?? 5,
//         connection: this.redisConnection,
//       },
//     );

//     // Log immediately when worker is instantiated
//     this.logger.log(`BullMQ worker instantiated for queue=${queueName}`);

//     // Listen for BullMQ ready event
//     worker.on('ready', () => {
//       this.logger.log(
//         `BullMQ worker ready and listening on queue=${queueName}`,
//       );
//     });

//     worker.on('completed', (job) =>
//       this.logger.debug(`BullMQ → Completed job ${job.id} (${job.name})`),
//     );

//     worker.on('failed', (job, err) =>
//       this.logger.error(`BullMQ → Failed job ${job?.id}`, err),
//     );

//     worker.on('stalled', (job: Job | string) => {
//       const jobId = typeof job === 'string' ? job : job?.id;
//       this.logger.warn(`BullMQ → Job stalled: ${jobId} on queue=${queueName}`);
//     });

//     this.workers.set(queueName, worker);
//     this.logger.log(`Subscribed BullMQ worker to queue=${queueName}`);

//     return { close: async () => this.closeWorker(queueName) };
//   }

//   private async closeWorker(queueName: string) {
//     const worker = this.workers.get(queueName);
//     if (worker) {
//       await worker.close();
//       this.workers.delete(queueName);
//       this.logger.log(`BullMQ worker closed for queue=${queueName}`);
//     }
//   }

//   async onModuleDestroy() {
//     await this.close();
//   }

//   async close(): Promise<void> {
//     for (const worker of this.workers.values()) await worker.close();
//     for (const queue of this.queues.values()) await queue.close();
//     this.logger.log('BullMQProvider closed.');
//   }
// }
