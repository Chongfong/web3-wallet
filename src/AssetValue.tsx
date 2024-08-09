import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useBalance } from "wagmi";
import { ERC20_TOKENS } from "./constants";
import PieChartComponent from "./PieChart";

export const AssetValue = () => {
  const [assets, setAssets] = useState<{
    id: number;
    value: number;
    icon: string;
    label: string;
    amount: number;
  }[]>([]);

  const [usdPrices, setUsdPrices] = useState<{
    [key: string]: { usd: number };
  }>({});

  const balance = useBalance({
    address: "0x6b175474e89094c44da98b954eedeac495271d0f", // account.address,
  });

  const fetchUsdPrices = () => {
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,usd-coin&vs_currencies=usd"
    )
      .then((data) => data.json())
      .then((price) => setUsdPrices(price));
  };

  useEffect(() => {
    fetchUsdPrices();
  }, []);

  useEffect(() => {
    const usdPricesValue = usdPrices || {};
    setAssets([
      {
        id: 1,
        label: "BITCOIN",
        amount: 10,
        value: 10 * usdPricesValue.bitcoin?.usd || 0,
        icon: ERC20_TOKENS[0].icon,
      },
      {
        id: 2,
        label: "Ethereum",
        amount: parseFloat(`${balance?.data?.value}`),
        value:
          (parseFloat(`${balance?.data?.value}`) / 10 ** 18) *
          usdPricesValue.ethereum?.usd ||
          0,
        icon: ERC20_TOKENS[1].icon,
      },
      {
        id: 3,
        label: "USD",
        amount: 20,
        value: 20 * usdPricesValue["usd-coin"]?.usd || 0,
        icon: ERC20_TOKENS[2].icon,
      },
    ]);
  }, [balance?.data?.value, usdPrices]);

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
