import {
  Box,
  Button,
  Popover,
  SvgIcon,
  CircularProgress,
  Typography,
} from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import intl from "react-intl-universal";
import { useScrollbarStyles } from "theme/useScrollbarStyles";
import { servicesState } from "recoil/atoms";
import { useSetRecoilState } from "recoil";
import { useGQLServices } from "do-ents/useGQLServices";
import { useShowServerError } from "hooks/useShowServerError";
import { AddServiceDialog } from "components/ModelBoard/EntityTree/AddServiceDialog";

export const ServiceList = memo(() => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const scrollStyles = useScrollbarStyles();
  const setServices = useSetRecoilState(servicesState);

  const { services, loading, error, refresh } = useGQLServices();

  useShowServerError(error);

  useEffect(() => {
    setServices(services || []);
  }, [services, setServices]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        variant="text"
        color="inherit"
        startIcon={
          <SvgIcon>
            <path
              fill="currentColor"
              d="M16 12C16 10.89 15.55 9.89 14.83 9.17L16.24 7.76C17.33 8.85 18 10.35 18 12C17.28 12 16.6 12.13 15.96 12.36C15.97 12.24 16 12.12 16 12M6.34 6.34L4.93 4.93C3.12 6.74 2 9.24 2 12S3.12 17.26 4.93 19.07L6.34 17.66C4.89 16.22 4 14.22 4 12C4 9.79 4.89 7.78 6.34 6.34M19.07 4.93L17.66 6.34C19.11 7.78 20 9.79 20 12C20 12.12 20 12.23 20 12.34C20.68 12.59 21.33 12.96 21.88 13.43C21.95 12.96 22 12.5 22 12C22 9.24 20.88 6.74 19.07 4.93M12 10C10.9 10 10 10.9 10 12S10.9 14 12 14 14 13.1 14 12 13.1 10 12 10M7.76 7.76C6.67 8.85 6 10.35 6 12S6.67 15.15 7.76 16.24L9.17 14.83C8.45 14.11 8 13.11 8 12S8.45 9.89 9.17 9.17L7.76 7.76M20.12 14.46L18 16.59L15.88 14.47L14.47 15.88L16.59 18L14.47 20.12L15.88 21.53L18 19.41L20.12 21.53L21.53 20.12L19.41 18L21.53 15.88L20.12 14.46Z"
            />
          </SvgIcon>
        }
        endIcon={<ArrowDropDownIcon />}
        onClick={handleClick}
      >
        {intl.get("select-service")}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexFlow: "column",
            width: "280px",
          }}
        >
          <Box
            sx={{
              height: (theme) => theme.spacing(6),
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: (theme) => theme.palette.divider + " solid 1px",
              pl: 2,
              pr: 2,
            }}
          >
            <Typography sx={{ color: (theme) => theme.palette.text.primary }}>
              {intl.get("services")}
            </Typography>
            <AddServiceDialog onAddFinished={refresh} />
          </Box>
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              p: 1,
              ...scrollStyles,
            }}
          >
            {loading ? <CircularProgress /> : <></>}
          </Box>
        </Box>
      </Popover>
    </>
  );
});
