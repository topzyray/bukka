import { SetMetadata } from '@nestjs/common';
import { Permission } from '../Dtos/Admin/RoleDto';
import { DecoratorKeyEnum } from '../Enums/DecoratorKeyEnum';

export const Permissions = (permissions: Permission[]) =>
  SetMetadata(DecoratorKeyEnum.PERMISSION, permissions);
