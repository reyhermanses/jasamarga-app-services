import ResetPasswordMasterRole from "../models/ResetPasswordMasterRole";

export class ResetPasswordMasterRoleRepository {
  static create = async (data: any) => {
    return await ResetPasswordMasterRole.create(data);
  };

  static read = async (filter: any) => {
    return await ResetPasswordMasterRole.findAll();
  };

  static update = async (id: string, data: any) => {
    return await ResetPasswordMasterRole.update(data, {
      where: {
        id: id,
      },
    });
  };

  static delete = async (id: string) => {
    return await ResetPasswordMasterRole.destroy({
      where: {
        id: id,
      },
    });
  };
}
