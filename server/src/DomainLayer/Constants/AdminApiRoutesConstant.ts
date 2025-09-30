import { GenericHelper } from 'src/InfrastructureLayer/Helpers/GenericHelper';
import { ApiVersionEnum } from '../Enums/ApiVersionEnum';
import { UserTypeEnum } from '../Enums/UserTypeEnum';
import { AdminApiRoutesEnum } from '../Enums/AdminApiRoutesEnum';

export class AdminApiRoutesConstant {
  static BASE_URL = `${
    ApiVersionEnum.VERSION_1
  }/${UserTypeEnum.ADMIN.toLowerCase()}`;

  static UserManagement = {
    getUserById: AdminApiRoutesEnum.GetUserById,
    updateUser: AdminApiRoutesEnum.UpdateUser,
    getUsersByFilters: AdminApiRoutesEnum.GetUsersByFilters,
  };

  static DeletedAccountManagement = {
    deleteUserAccount: AdminApiRoutesEnum.DeleteUserAccount,
  };

  static AdminApiRoutesMap = {
    ...AdminApiRoutesConstant.UserManagement,
    ...AdminApiRoutesConstant.DeletedAccountManagement,
  };

  static AdminApiRoutesMapInvert = GenericHelper.invertObject(
    AdminApiRoutesConstant.AdminApiRoutesMap,
  );
}
