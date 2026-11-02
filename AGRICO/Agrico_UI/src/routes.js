import Icon from "@mui/material/Icon";
import LoginPage from "views/LoginPage/LoginPage";
import NotAvailable from "views/LoginPage/NotAvailable";
import AGSM003 from "views/Planning/AGSM003";
import AGSM004 from "views/Reports/AGSM004";
import AGSM006 from "views/Reports/AGSM006";
import AGSM012 from "views/Reports/AGSM012";
import FullScreenNavBar from "examples/Navbars/FullScreenNavbar";
import PasswordReset from "views/LoginPage/passwordReset";
import QueryPage from "views/CommonModule/QueryPage";
const routes = [
  {
    name: "Planning & Scheduling", icon: <Icon>dashboard</Icon>, columns: 1, rowsPerColumn: 2,
    collapse: [{ name: "Planning", collapse: [
      { name: "Receive Raw Material", route: "/agsm003", component: <AGSM003 key="receive" /> },
    ] }],
  },
  {
    name: "Reports", icon: <Icon>dashboard</Icon>, columns: 1, rowsPerColumn: 2,
    collapse: [{ name: "Pages", collapse: [
      { name: "Production Report", route: "/agsm006", component: <AGSM006 /> },
      { name: "In-transit / RM Receiving Report", route: "/agsm004", component: <AGSM004 /> },
      { name: "Inventory", route: "/agsm012", component: <AGSM012 /> },
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
