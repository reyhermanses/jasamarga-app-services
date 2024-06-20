class LoginController {
  static username: string;
  static password: string;
  static isLogin: boolean = true;

  // constructor(username: string, password: string) {
  //   LoginController.username = username;
  //   LoginController.password = password;
  // }

  static login = async () => {};

  set setLogin(value: any) {
    LoginController.isLogin = value;
  }

  get getLogin(): boolean {
    return LoginController.isLogin;
  }
}

export default LoginController;
