import Icon from "@mui/material/Icon";
import LoginPage from "views/LoginPage/LoginPage";
import NotAvailable from "views/LoginPage/NotAvailable";
import TTSM003 from "views/Planning/TTSM003";
import TTSM006 from "views/Reports/TTSM006";
import TTSM012 from "views/Reports/TTSM012";
import FullScreenNavBar from "examples/Navbars/FullScreenNavbar";
import PasswordReset from "views/LoginPage/passwordReset";
import QueryPage from "views/CommonModule/QueryPage";
const routes = [
  {
    name: "Planning & Scheduling", icon: <Icon>dashboard</Icon>, columns: 1, rowsPerColumn: 2,
    collapse: [{ name: "Planning", collapse: [
      { name: "Receive Raw Material", route: "/agsm003", component: <TTSM003 key="receive" /> },
    ] }],
  },
  {
    name: "Reports", icon: <Icon>dashboard</Icon>, columns: 1, rowsPerColumn: 2,
    collapse: [{ name: "Pages", collapse: [
      { name: "Production Report", route: "/agsm006", component: <TTSM006 /> },
      { name: "In-transit / RM Receiving Report", route: "/agsm004", component: <TTSM003 key="report" reportOnly /> },
      { name: "Inventory", route: "/agsm012", component: <TTSM012 /> },
    ] }],
  },
  {
    name: "User",
    icon: <Icon>dashboard</Icon>,
    columns: 1,
    rowsPerColumn: 2,
    collapse: [
      {
        name: "account",
        collapse: [
          {
            name: "Log Out",
            route: "/signin",
            component: <LoginPage />,
          },
          {
            name: "Reset Password",
            route: "/resetPassword/:id",
            component: <PasswordReset />,
          },
          {
            name: "Under Maintenance",
            route: "/undermaintenance",
            component: <NotAvailable />,
          },
          {
            name: "FullscreenNav",
            route: "/navigate",
            component: <FullScreenNavBar open="true" />,
          },
          {
            name: "querypage",
            route: "/querypage",
            component: <QueryPage />,
          },
        ],
      },
    ],
  },
];

export default routes;
