import { Typography as MuiTypography, TypographyProps } from "@mui/material";
import { FC, ReactNode } from "react";

type TTypography = {
  marginBottom?: boolean;
  marginTop?: boolean;
} & Omit<TypographyProps, "marginBottom" | "marginTop">;

type TVariant = Pick<TypographyProps, "variant">;

export const Typography: FC<TTypography> = ({ children, marginBottom, marginTop, variant, ...props }) => {
  const getMargin = (variant: TVariant) => {
    switch (variant) {
      case "h1":
        return "54px";
      case "h2":
        return "46px";
      case "h3":
        return "38px";
      case "h4":
        return "30px";
      case "h5":
        return "16px";
      case "h6":
        return "8px";
      case "body1":
        return "4px";
      default:
        return undefined;
    }
  };

  return (
    <MuiTypography
      marginTop={marginTop ? getMargin(variant as TVariant) : undefined}
      marginBottom={marginBottom ? getMargin(variant as TVariant) : undefined}
      variant={variant}
      {...props}
    >
      {children}
    </MuiTypography>
  );
};
