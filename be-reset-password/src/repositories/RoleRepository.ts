import ResetPasswordRole from "../models/ResetPasswordRole";

export class RoleRepository {
  static create = async (data: any) => {
    return await ResetPasswordRole.create(data);
  };
  static read = async (filter: any) => {
    return await ResetPasswordRole.findAll(filter);
  };
  static update = async (id: string, data: any) => {
    return await ResetPasswordRole.update(data, {
      where: {
        id: id,
      },
    });
  };
  static delete = async (id: string) => {
    return await ResetPasswordRole.destroy({
      where: {
        id: id,
      },
    });
  };
}
