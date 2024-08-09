import { Box, Modal, Typography, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import TransferAssets from "./TransferAssets";
import { ERC20_TOKENS } from "./constants";
import { useBalance } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import { setAssets, setBalance, setUsdPrices } from "./assetsSlice";

export const AssetList = () => {
  const dispatch = useDispatch();
  const assetsData = useSelector(
    (state: { assetsData: any }) => state.assetsData
  );
  const { assets, balance, usdPrices } = assetsData;

  const { data: balanceData } = useBalance({
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
  });

  useEffect(() => {
    const fetchUsdPrices = () => {
      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,usd-coin&vs_currencies=usd"
      )
        .then((data) => data.json())
        .then((price) => {
          dispatch(setUsdPrices(price));
        });
    };

    fetchUsdPrices();
  }, [dispatch]);

  useEffect(() => {
    if (balanceData) {
      dispatch(setBalance(balanceData));
    }
  }, [balanceData, dispatch]);

  useEffect(() => {
    const usdPricesValue = usdPrices || {};

    const newAssets = [
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
        amount: parseFloat(`${balance?.value}`),
        value:
          (parseFloat(`${balance?.value}`) / 10 ** 18) *
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
    ];
    dispatch(setAssets(newAssets));
  }, [balance?.value, usdPrices, dispatch]);

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const columns: GridColDef[] = [
    {
      field: "asset",
      headerName: "Asset",
      width: 130,
      renderCell: (params) => {
        const row = params.row;
        return (
          <Box display="flex" gap={1} height="100%" alignItems="center">
            <img
              style={{ width: 20, height: 20 }}
              src={row.icon}
              alt={row.label}
            />
            <Typography variant="body2">{row.label}</Typography>
          </Box>
        );
      },
    },
    { field: "amount", headerName: "Amount", width: 130 },
    { field: "value", headerName: "Value", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      renderCell: () => (
        <Button onClick={handleOpen} style={{ cursor: "pointer" }}>
          Transfer
        </Button>
      ),
    },
  ];

  return (
    <Box
      display="flex"
      borderRadius="8px"
      border="1px solid rgba(0, 0, 0, 0.26)"
      padding={3}
      flexDirection="column"
      gap={1}
      width="100%"
    >
      <Typography variant="h5">Asset List</Typography>
      <Typography variant="body2" color="gray">
        View your cryptocurrency assets and their current value.
      </Typography>

      <Box height="400px" width="100%" marginTop={3}>
        <DataGrid rows={assets} columns={columns} />
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TransferAssets />
        </Box>
      </Modal>
    </Box>
  );
};

