import {
  General_Unauthorized,
  Refresh_UsedTokenError,
  Refresh_WrongTokenError,
} from "../../../../../shared/consts/error";

// ROUTER URLS
export const EMPTY_URL = "/";

export const AUTH_URL = "/auth";
export const SIGN_IN_URL = "signin";
export const SIGN_UP_URL = "signup";
export const RESTORE_URL = "restore";

export const MAIN_URL = "/main";
export const GET_SETUP_URL = "get-config";
export const PAYMENT_URL = "payment";
export const PROFILE_URL = "profile";
export const ABOUT_URL = "about";

export const CREATOR_URL = "creator";
export const EDIT_ENTITIES_URL = "edit-entities";
export const EDIT_ENTITIES_CARS_URL = "cars";
export const EDIT_ENTITIES_BUNDLES_URL = "bundles";
export const EDIT_ENTITIES_SETUPS_URL = "setups";
export const EDIT_ENTITIES_PROMOCODES_URL = "promocodes";
export const UPDATE_ENTITY_URL = ":id/edit";

export const STATISTICS_URL = "statistics";
export const STATISTICS_PROMOCODES_URL = "promocodes";

// export const FALLBACK_URL = "*";

// LOCAL STORAGE KEYS
export const USER_ACCESS_TOKEN_KEY = "user-token";
export const USER_REFRESH_TOKEN_KEY = "refresh-token";
export const COLOR_THEME_KEY = "usehooks-ts-dark-mode";
export const FAQ_POPUP_KEY = "faq-popup";

// ENV VARS
export const API_URL = import.meta.env.VITE_REACT_APP_REST_ENDPOINT;

// BROADCAST CHANNEL KEYS
export const HTTP_BROADCAST_KEY = "httpInterceptor";

// NETWORK ERRORS
export const NETWORK_ERROR = "ERR_NETWORK";
export const AUTH_ERRORS: Array<string | undefined> = [General_Unauthorized];
export const REFRESH_ERRORS: Array<string | undefined> = [Refresh_WrongTokenError];
