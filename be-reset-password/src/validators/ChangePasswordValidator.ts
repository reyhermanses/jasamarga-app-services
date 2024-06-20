import { 
  IsString, 
  isNotEmpty, 
  MaxLength,
  IsEmail, 
  MinLength,
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
 } from 'class-validator';
import UserAuth from '../models/UserAuth';
import ResetPassword from '../models/ResetPassword';

//check if exist user or not

@ValidatorConstraint({ name: 'uniqueUsername', async: true })
export class UniqueUsernameConstraint implements ValidatorConstraintInterface {
  async validate(username: string, args: ValidationArguments) {
    const existingUser = await UserAuth.findOne({ where: { username : username } });
    return existingUser ? true : false; // Return true if username is unique
  }

  defaultMessage(args: ValidationArguments) {
    return `Username ${args.value} is not exists.`;
  }
}

export function UniqueUsername(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueUsernameConstraint,
    });
  };
}

// end check if user exist or not

// check if password equals to confirmation password

@ValidatorConstraint({ name: 'passwordMatch', async: false })
export class PasswordMatchConstraint implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    const confirmPassword = (args.object as any)[args.constraints[0]];

    return password === confirmPassword;
  }

  defaultMessage(args: ValidationArguments) {
    return `Passwords do not match.`;
  }
}

export function PasswordMatch(property: string, validationOptions?: ValidationOptions) {
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

// end check if password equals to confirmation password


//check if exist user or not

@ValidatorConstraint({ name: 'uniqueToken', async: true })
export class TokenMatchConstraint implements ValidatorConstraintInterface {
  async validate(token: string, args: ValidationArguments) {
    const existingUser = await ResetPassword.findOne({ where: { random : token } });
    return existingUser ? true : false; // Return true if username is unique
  }

  defaultMessage(args: ValidationArguments) {
    return `Token ${args.value} is not exists.`;
  }
}

export function UniqueToken(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: TokenMatchConstraint,
    });
  };
}

// end check if user exist or not

class ChangePasswordValidator {
  @IsString()
  @MinLength(5)
  @UniqueToken()
  token: string;

  @IsString()
  @MaxLength(12)
  @MinLength(5)
  password: string;

  // @IsString()
  // @MinLength(6)
  // @PasswordMatch('password')
  // confirmPassword: string;

  constructor(
    token: string,
    password: string
    // , confirmPassword: string
    ) {
    this.token = token;
    this.password = password;
    // this.confirmPassword = confirmPassword;
  }
}

export default ChangePasswordValidator;
