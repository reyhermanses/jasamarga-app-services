import {
  IsNotEmpty,
  MaxLength,
  MinLength,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from "class-validator";

@ValidatorConstraint({ name: "passwordMatch", async: false })
export class PasswordMatchConstraint implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    const confirmPassword = (args.object as any)[args.constraints[0]];

    return password === confirmPassword;
  }

  defaultMessage(args: ValidationArguments) {
    return `Passwords do not match.`;
  }
}

export function PasswordMatch(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: PasswordMatchConstraint,
    });
  };
}

class AdminChangePasswordValidator {
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(15)
  password: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(15)
  @PasswordMatch("password")
  passwordConfirmation: string;

  constructor(password: string, passwordConfirmation: string) {
    this.password = password;
    this.passwordConfirmation = passwordConfirmation;
  }
}

export default AdminChangePasswordValidator;
