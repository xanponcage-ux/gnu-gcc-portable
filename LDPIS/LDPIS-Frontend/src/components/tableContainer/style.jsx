import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const UIBox = styled(Box)(({ theme }) => ({
  "& .header": {
    backgroundColor: theme?.palette.primary.main,
    borderRadius: "10px",
    padding: 0,
    margin: "12px",
    width: "calc(100% - 24px)",
    minHeight: "40px",
    marginBottom: "0px",
    zIndex: 1,
    "& p": {
      color: theme?.palette.text.primaryRev,
    },
  },
  "& .MuiGrid-item.body-container": {
    marginTop: "-15px",
    padding: "15px",
    paddingTop: "30px",
    backgroundColor: theme?.palette.background.paper,
    borderRadius: "10px",
  },
}));
