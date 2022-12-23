import { FC } from "react";
import { Typography } from "../../../../core/components/kit/Typography/Typography";

type InfoProps = {
  title?: string;
  data?: string;
};

export const Info: FC<InfoProps> = ({ title, data }) => {
  return (
    <div>
      <Typography variant="h4" marginBottom>
        {title}
      </Typography>
      <Typography variant="h5">{data}</Typography>
    </div>
  );
};
