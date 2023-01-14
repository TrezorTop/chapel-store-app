export type ErrorResponse = {
	message: string,
	info?: object
}


export const UndocumentedError = "Что-то пошло не так...";
export const VeryBadThingsHappend = "Опять за работу :(";

export const General_Unauthorized = "Не авторизован";
export const General_WrongRequestSyntax = "Ошибка синтаксиса в запросе";
export const General_NotEnoughtPermissions = "Недостаточно прав";
export const General_FileIsTooLarge = "Файл слишком велик";

export const Login_WrongUsernameError = "Неправильное имя пользователя";
export const Login_WrongPasswordError = "Неверный пароль";

export const Refresh_WrongTokenError = "Неправильный токен";
export const Refresh_UsedTokenError = "Токен уже был использован";

export const CreateConfigs_WrongCarId = "Неверный carId";
export const CreateConfigs_WrongBundleId = "Неверный bundleId";
export const CreateConfigs_NotEnoughFiles = "Недостаточно файлов";

export const CreateBundles_WrongConfigId = "Такого конфига не существует";

export const DeleteConfigs_NotFound = "Такого конфига не существует";

export const DeleteConfigs_BundlesRelationNotEmpty = "У конфига есть связи с бандлами";

export const UpdateCars_NotFound = "Такой машины не существует";

export const UpdateConfigs_NotFound = "Такого конфига не существует";

export const DeleteByIdCars_NotFound = "Такой машины не существует";

export const UpdateBundles_NotFound = "Такого бандла не существует";

export const DeleteByIdBundles_NotFound = "Такого бандла не существует";

export const GetByIdBundles_NotFound = "Такого бандла не существует";

export const GetByIdCars_NotFound = "Такой машины не существует";

export const GetByIdConfigs_NotFound = "Такого конфига не существует";

export const GetBundleFiles_NotFound = "Такого бандла не существует";