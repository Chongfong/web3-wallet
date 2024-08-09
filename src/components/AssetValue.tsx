import { Box, Typography } from "@mui/material";
import PieChartComponent from "./PieChart";
import { useSelector } from "react-redux";

export const AssetValue = () => {

    const { assets } = useSelector((state: { assetsData: any }) => state.assetsData);

  return (
    <>
      <Box
        display="flex"
        borderRadius="8px"
        border="1px solid rgba(0, 0, 0, 0.26)"
        padding={3}
        flexDirection="column"
        gap={1}
        width="100%"
      >
        <Typography variant="h5">Asset Value</Typography>
        <Typography variant="body2" color="gray">
          Breakdown of your total asset value across different cryptocurrencies.
        </Typography>

        <Box
          display="flex"
          justifyContent="center"
          marginTop={3}
          width="100%"
          flexDirection="row"
        >
          <PieChartComponent data={assets} />
        </Box>
      </Box>
    </>
  );
};
