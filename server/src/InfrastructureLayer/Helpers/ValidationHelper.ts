import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import * as bcrypt from 'bcryptjs';

@ValidatorConstraint({ name: 'fieldsMatch', async: false })
export class FieldsMatchConstraint implements ValidatorConstraintInterface {
  validate(fieldValue: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return fieldValue === relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${relatedPropertyName} and ${args.property} do not match!`;
  }
}

@ValidatorConstraint({ name: 'isPasswordStrong', async: false })
export class IsPasswordStrongConstraint
  implements ValidatorConstraintInterface
{
  validate(password: string) {
    const regex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    return regex.test(password);
  }

  defaultMessage() {
    return 'Password must contain at least one letter, one number, and one special character, and be at least 8 characters long.';
  }
}

@Injectable()
export class ValidationHelper {
  static async validatePassword(
    first_value: string,
    second_value: string,
  ): Promise<boolean> {
    return await bcrypt.compare(first_value, second_value);
  }

  static FieldsMatch =
    (relatedPropertyName: string, validationOptions?: ValidationOptions) =>
    (object: Record<string, any>, propertyName: string) =>
      registerDecorator({
        name: 'fieldsMatch',
        target: object.constructor,
        propertyName,
        constraints: [relatedPropertyName],
        options: validationOptions,
        validator: FieldsMatchConstraint,
      });

  static IsPasswordStrong =
    (validationOptions?: ValidationOptions) =>
    (object: Record<string, any>, propertyName: string) =>
      registerDecorator({
        name: 'isPasswordStrong',
        target: object.constructor,
        propertyName,
        options: validationOptions,
        validator: IsPasswordStrongConstraint,
      });
}
