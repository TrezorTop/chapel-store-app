export type ErrorResponse = {
	readonly message: string
}


export const UndocumentedError = "Что-то пошло не так...";

export const General_Unauthorized = "Не авторизован";

export const Login_WrongUsernameError = "Неправильное имя пользователя";
export const Login_WrongPasswordError = "Неверный пароль";

export const Refresh_WrongTokenError = "Неправильный токен";
export const Refresh_UsedTokenError = "Токен уже был использован";

export const CreateConfigs_WrongCarId = "Неверный carId";
export const CreateConfigs_WrongBundleId = "Неверный bundleId";