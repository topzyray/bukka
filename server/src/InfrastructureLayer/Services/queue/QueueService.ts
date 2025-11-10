import { Injectable } from '@nestjs/common';
import { QueueFactory } from './QueueFactory';
import {
  QueueEnvelope,
  SubscribeOptions,
  SendOptions,
  IQueueProvider,
  SubscriptionHandle,
} from 'src/DataLayer/Abstracts/Interfaces/IQueueProvider';
import { QueueProviderEnum } from 'src/DomainLayer/Enums/QueueProviderEnum';

@Injectable()
export class QueueService {
  constructor(private readonly queueFactory: QueueFactory) {}

  private getProvider(provider?: QueueProviderEnum): IQueueProvider {
    return this.queueFactory.getProvider(provider);
  }

  async publishToQueue(
    queueName: string,
    message: QueueEnvelope,
    opts?: SendOptions & { provider?: QueueProviderEnum },
  ) {
    const provider = this.getProvider(opts?.provider);
    return provider.publish(queueName, message, opts);
  }

  async subscribeToQueue(
    queueName: string,
    handler: (message: QueueEnvelope<any>) => Promise<void>,
    options?: SubscribeOptions & { provider?: QueueProviderEnum },
  ) {
    const provider = this.getProvider(options?.provider);
    return provider.consume(queueName, handler, options);
  }

  async subscribeToMultipleProviders(
    queueName: string,
    handler: (message: QueueEnvelope<any>) => Promise<void>,
    providerTypes: QueueProviderEnum[],
    options?: SubscribeOptions,
  ): Promise<SubscriptionHandle[]> {
    const handles: SubscriptionHandle[] = [];
    for (const providerType of providerTypes) {
      const handle = await this.subscribeToQueue(queueName, handler, {
        ...options,
        provider: providerType,
      });
      handles.push(handle);
    }
    return handles;
  }
}
