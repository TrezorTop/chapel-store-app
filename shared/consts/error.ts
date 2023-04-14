export type ErrorResponse = {
	message: string,
	info?: object
}


export const UndocumentedError = "Internal Server Error";
export const VeryBadThingsHappend = "Critical Server Error";

export const General_Unauthorized = "Not Authorized";
export const General_WrongRequestSyntax = "Syntax Error In Request";
export const General_NotEnoughtPermissions = "Not Enough Rights";
export const General_FileIsTooLarge = "The file is too large";

export const Login_WrongUsernameError = "Invalid username";
export const Login_WrongPasswordError = "Wrong password";

export const Register_EmailInUseError = "Email already in use";
export const Register_UsernameInUseError = "Username already in use";

export const RequestResetPassword_UserDoesNotExists = "User does not exist";
export const ConfirmResetPassword_WrongToken = "Invalid Code";
export const VerifyEmail_WrongToken = "Invalid Code";

export const Refresh_WrongTokenError = "Invalid Code";
export const Refresh_UsedTokenError = "This token has already been used";

export const CreateConfigs_WrongCarId = "Invalid car";
export const CreateConfigs_NotEnoughFiles = "Not enough files";

export const CreateBundles_WrongConfigId = "This setup does not exist";

export const DeleteConfigs_NotFound = "This setup does not exist";

export const DeleteConfigs_BundlesRelationNotEmpty = "The setup has links with bundles";

export const UpdateBundles_NotFound = "This bundle does not exist";

export const UpdateCars_NotFound = "This car does not exist";

export const UpdateConfigs_NotFound = "This setup does not exist";

export const DeleteByIdCars_NotFound = "This car does not exist";

export const DeleteUncommittedOrder_NotFound = "This order does not exist";
export const ApplyPromocodes_BundleNotFound = "This bundle does not exist";
export const ApplyPromocodes_PromocodeNotFound = "This promocode does not exist";
export const CreatePurchases_BundleNotFound = "This bundle does not exist";
export const CreatePurchases_PromocodeNotFound = "This promocode does not exist";

export const CreateManualPurchases_BundleNotFound = "This bundle does not exist";
export const CreateManualPurchases_UserNotFound = "This user does not exist";

export const DeleteByIdBundles_NotFound = "This bundle does not exist";
export const UpdatePromocodes_NotFound = "This promocode does not exist";

export const GetByIdBundles_NotFound = "This promocode does not exist";
export const GetByIdPromocodes_NotFound = "Такого промокода не существует";

export const GetByIdCars_NotFound = "This car does not exist";

export const GetByIdConfigs_NotFound = "This setup does not exist";

export const GetBundleFiles_NotFound = "This bundle does not exist";