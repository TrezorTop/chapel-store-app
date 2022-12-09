export type ErrorResponse = {
	readonly message: string
}


export const UndocumentedError = "Что-то пошло не так...";

export const Login_WrongUsernameError = "Неправильное имя пользователя";
export const Login_WrongPasswordError = "Неверный пароль";

export const Refresh_WrongTokenError = "Неправильный токен";
export const Refresh_UsedTokenError = "Токен уже был использован";

