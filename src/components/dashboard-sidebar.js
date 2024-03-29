import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { Box, Divider, Drawer, useMediaQuery } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import { ChartBar as ChartBarIcon } from "../icons/chart-bar";
import { Users as UsersIcon } from "../icons/users";
import { NavItem } from "./nav-item";
import { AppContext } from "../context/AppContext";

const items = [
  {
    href: "/",
    icon: <ChartBarIcon fontSize="small" />,
    title: "Thống kê",
    admin: false,
  },
  {
    href: "/user_list",
    icon: <FormatListNumberedIcon fontSize="small" />,
    title: "Danh sách tài khoản",
    admin: false,
  },

  {
    href: "/premiere_list",
    icon: <FormatListNumberedIcon fontSize="small" />,
    title: "Danh sách suất chiếu",
    admin: true,
  },
  {
    href: "/movies_list",
    icon: <FormatListNumberedIcon fontSize="small" />,
    title: "Danh sách phim ",
    admin: false,
  },
  {
    href: "/sale_register",
    icon: <FormatListNumberedIcon fontSize="small" />,
    title: "Danh sách người dùng",
    admin: false,
  },
  {
    href: "/logout",
    icon: <LogoutIcon fontSize="small" />,
    title: "Đăng xuất",
    admin: false,
  },
];

export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const { isAdmin } = useContext(AppContext);
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
    defaultMatches: true,
    noSsr: false,
  });

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  const content = (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Divider
          sx={{
            borderColor: "#2D3748",
            my: 3,
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {items.map((item) => {
            return (
              <>
                {item.admin ? (
                  isAdmin && (
                    <NavItem
                      key={item.title}
                      icon={item.icon}
                      href={item.href}
                      title={item.title}
                    />
                  )
                ) : (
                  <NavItem key={item.title} icon={item.icon} href={item.href} title={item.title} />
                )}
              </>
            );
          })}
        </Box>
        <Divider sx={{ borderColor: "#2D3748" }} />
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.900",
            color: "#FFFFFF",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.900",
          color: "#FFFFFF",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
