import { QueueEnumHelper } from 'src/InfrastructureLayer/Helpers/QueueEnumHelper';

export const QueueEnum = QueueEnumHelper.createQueueEnum({
  NOTIFICATION: 'NOTIFICATION',
  AUTH_NOTIFICATION: 'AUTH_NOTIFICATION',
  USER_NOTIFICATION: 'USER_NOTIFICATION',
  AUDIT_LOG: 'AUDIT_LOG',
  EXCEPTION_LOG: 'EXCEPTION_LOG',
});
