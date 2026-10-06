import { Grid, Box, Typography } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const TableContainer = (props) => {
  return (
    <>
      <MDBox
        mx={2}
        mt={-1}
        py={0.25}
        px={2}
        variant="gradient"
        bgColor="info"
        borderRadius="lg"
        coloredShadow="info"
      >
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={4}>
            <MDTypography variant="h6" color="white">
              {props?.title}
            </MDTypography>
          </Grid>

          <Grid item xs={2}></Grid>
          <Grid item xs={2}>
            {props?.headerContainer}
          </Grid>
        </Grid>
      </MDBox>
      <MDBox px={3} py={3} sx={{pt: 0}}>
        {props?.children}
      </MDBox>
    </>
  );
};

export default TableContainer;
