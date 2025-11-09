export interface IQueueProvider {
  publish<T>(
    queueName: string,
    message: QueueEnvelope<T>,
    options?: SendOptions,
  ): Promise<void>;

  consume(
    queueName: string,
    handler: (message: QueueEnvelope<any>) => Promise<void>,
    options?: SubscribeOptions,
  ): Promise<SubscriptionHandle>;

  close(): Promise<void>;
}

export interface QueueEnvelope<T = any> {
  messageType: string;
  payload: T;
}

export type SendOptions = {
  messageId?: string;
  correlationId?: string;
  applicationProperties?: Record<string, any>;
  retry?: number;
  timeoutMs?: number;
};

export type SubscribeOptions = {
  maxConcurrentCalls?: number; // concurrency
  autoComplete?: boolean; // let handler complete message or SDK
  lockRenewal?: boolean; // auto renew locks
  retryAttempts?: number;
  retryDelayMs?: number;
  receiveMode?: 'peekLock' | 'receiveAndDelete';
};

export type SubscriptionHandle = {
  close: () => Promise<void>;
};
