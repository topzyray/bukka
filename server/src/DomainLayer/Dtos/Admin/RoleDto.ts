import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ActionEnum } from 'src/DomainLayer/Enums/ActionEnum';
import { ResourceEnum } from 'src/DomainLayer/Enums/ResourceEnum';
import { UserRoleEnum } from 'src/DomainLayer/Enums/UserRoleEnum';

export class CreateRoleDto {
  @ApiProperty({ example: UserRoleEnum.USER, required: true })
  @IsEnum(UserRoleEnum)
  @IsNotEmpty()
  name: UserRoleEnum;

  @ApiProperty({
    example: {
      resource: ResourceEnum.USER,
      actions: [ActionEnum.CREATE, ActionEnum.READ],
    },
    required: true,
  })
  @ValidateNested()
  @Type(() => Permission)
  @IsNotEmpty()
  permissions: Permission[];
}

export class Permission {
  //   @ApiProperty({ example: ResourceEnum.USER, required: true })
  @IsEnum(ResourceEnum)
  @IsNotEmpty()
  resource: ResourceEnum;

  //   @ApiProperty({
  //     example: [ActionEnum.CREATE, ActionEnum.READ],
  //     required: true,
  //   })
  @IsEnum(ActionEnum, { each: true })
  @ArrayUnique()
  @IsNotEmpty()
  actions: ActionEnum[];
}
