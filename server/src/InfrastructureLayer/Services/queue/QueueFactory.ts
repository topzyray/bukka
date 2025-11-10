import { Injectable } from '@nestjs/common';
import { IQueueProvider } from 'src/DataLayer/Abstracts/Interfaces/IQueueProvider';
import { QueueProviderEnum } from 'src/DomainLayer/Enums/QueueProviderEnum';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';
import { BullMQProvider } from './providers/BullMQProvider';

@Injectable()
export class QueueFactory {
  constructor(
    private readonly bullMQProvider: BullMQProvider,
    private readonly configService: AppConfigurationService,
  ) {}

  getProvider(providerType?: QueueProviderEnum): IQueueProvider {
    const selected = providerType ?? this.configService.queueProvider;

    switch (selected) {
      case QueueProviderEnum.BULLMQ:
        return this.bullMQProvider;
      default:
        throw new Error(`Invalid or Missing Queue Provider: ${selected}`);
    }
  }
}
