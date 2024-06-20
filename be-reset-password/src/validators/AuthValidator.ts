import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

class AuthValidator {
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(15)
  username: string;

  @IsNotEmpty()
  @MinLength(3)
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}

export default AuthValidator;
