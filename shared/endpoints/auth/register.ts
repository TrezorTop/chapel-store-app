import { AuthRootPath, BasePath } from "../../index";
import { Validator } from "../../types";

export const RegisterBasePath = "/register";

export const RegisterPath = `${BasePath}${AuthRootPath}${RegisterBasePath}`;

export const RegisterRequestValidator: Validator<RegisterRequest> = {
  username: {
    check: [
      (value) => value.length >= 8 || "Минимальная длина 8 символов",
      (value) => value.length <= 32 || "Максимальная длина 32 символа",
      (value) => !/[^a-zA-Z\d_.]/gu.test(value) || "Разрешенные символы: a-Z, A-Z, цифры, _ и .",
    ],
    required: true,
  },
  password: {
    check: [
      (value) => value.length >= 8 || "Минимальная длина 8 символов",
      (value) => value.length <= 32 || "Максимальная длина 32 символа",
      (value) => !/[^a-zA-Z\d_.!@#$%^&*']/gu.test(value) || "Разрешенные символы: a-Z, A-Z, цифры и '_.!@#$%^&*'",
    ],
    required: true,
  },
  email: {
    check: [(value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Невалидный E-Mail"],
    required: true,
  },
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  accessToken: string;
  refreshToken: string;
};
