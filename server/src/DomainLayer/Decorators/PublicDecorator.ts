import { SetMetadata } from '@nestjs/common';
import { DecoratorKeyEnum } from '../Enums/DecoratorKeyEnum';

export const Public = () => SetMetadata(DecoratorKeyEnum.PUBLIC, true);
