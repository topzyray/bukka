import { ActionEnum } from '../Enums/ActionEnum';
import { ResourceEnum } from '../Enums/ResourceEnum';

class Permission {
  id?: number;
  resource: ResourceEnum;
  actions: ActionEnum[];
}

export class Role {
  id: number;
  name: string;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}
