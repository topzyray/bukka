import { GenericHelper } from 'src/InfrastructureLayer/Helpers/GenericHelper';
import { ApiVersionEnum } from '../Enums/ApiVersionEnum';
import { BaseApiRoutesEnum } from '../Enums/BaseApiRoutesEnum';

export class BaseApiRoutesConstant {
  static BASE_URL = `${ApiVersionEnum.VERSION_1}`;

  static Auth = {
    Signup: BaseApiRoutesEnum.Signup,
    Login: BaseApiRoutesEnum.Login,
    ConfirmEmail: BaseApiRoutesEnum.ConfirmEmail,
    resendConfirmationEmail: BaseApiRoutesEnum.ResendConfirmationEmail,
    refreshToken: BaseApiRoutesEnum.RefreshToken,
    forgotPassword: BaseApiRoutesEnum.ForgotPassword,
    resetPassword: BaseApiRoutesEnum.ResetPassword,
    changePassword: BaseApiRoutesEnum.ChangePassword,
  };

  static User = {
    getUserById: BaseApiRoutesEnum.GetUserById,
    getUserByEmail: BaseApiRoutesEnum.GetUserByEmail,
    getUserByFilters: BaseApiRoutesEnum.GetUserByFilters,
    updateUser: BaseApiRoutesEnum.UpdateUser,
    updateUserProfile: BaseApiRoutesEnum.UpdateUserProfile,
    deleteUser: BaseApiRoutesEnum.DeleteUser,
  };

  static Restaurant = {
    createRestaurant: BaseApiRoutesEnum.CreateRestaurant,
    getRestaurantById: BaseApiRoutesEnum.GetRestaurantById,
    getPinnedRestaurantByUser: BaseApiRoutesEnum.GetPinnedRestaurantByUser,
    getRestaurantByFilters: BaseApiRoutesEnum.GetRestaurantsByFilters,
    getRestaurantWithDistance: BaseApiRoutesEnum.GetRestaurantsWithinDistance,
    updateRestaurant: BaseApiRoutesEnum.UpdateRestaurant,
    updateRestaurantAddress: BaseApiRoutesEnum.UpdateRestaurantAddress,
    deleteRestaurant: BaseApiRoutesEnum.DeleteRestaurant,
  };

  static BaseApiRoutesMap = {
    ...BaseApiRoutesConstant.Auth,
    ...BaseApiRoutesConstant.User,
    ...BaseApiRoutesConstant.Restaurant,
  };

  static BaseApiRoutesMapInvert = GenericHelper.invertObject(
    BaseApiRoutesConstant.BaseApiRoutesMap,
  );
}
