/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/pages/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import Dashboard from "views/pages/Dashboard";
import { RiwayatPesan } from "views/pages/RiwayatPesan";
import Order from "layouts/Order";
import Pesan from "views/pages/Pesan";
import DetailPesanan from "views/pages/DetailPesanan";
import Pembayaran from "views/pages/Pembayaran";
import Bayar from "views/pages/Bayar";
import Deposit from "views/pages/Deposit";

var routes = [
  // {
  //   path: "/index",
  //   name: "Index",
  //   icon: "ni ni-tv-2 text-primary",
  //   component: <Index />,
  //   layout: "/admin",
  // },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/riwayat",
    name: "Riwayat Pesan",
    icon: "fa-solid fa-clock-rotate-left text-primary",
    component: <RiwayatPesan/>,
    layout: "/admin"
  },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: "ni ni-planet text-blue",
  //   component: <Icons />,
  //   layout: "/admin",
  // },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: "ni ni-pin-3 text-orange",
  //   component: <Maps />,
  //   layout: "/admin",
  // },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
  },
  {
    path: "/bayar",
    name:"Customer Bayar",
    icon: "ni ni-money-coins",
    component:  <Bayar/>,
    layout: "/admin",
  },

  // {
  //   path: "/deposit",
  //   name: "Deposit",
  //   icon: "fas fa-wallet text-red",
  //   component: <Deposit />,
  //   layout: "/admin",
  // },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },

  // {
  //   path: "",
  //   name: "Pesanan",
  //   icon: "fa-solid fa-bag-shopping",
  //   component: <Pesan/>,
  //   layout: "/Pesanan"

  // },
  // {
  //   path: "/register",
  //   name: "Register",
  //   icon: "ni ni-circle-08 text-pink",
  //   component: <Register />,
  //   layout: "/auth",
  // },
];
export default routes;
