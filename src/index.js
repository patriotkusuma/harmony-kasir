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
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AuthLayout from "layouts/Auth.js";
import { Dashboard } from "views/pages/Dashboard";
import Admin from "layouts/Admin";
import Order from "layouts/Order";
import Pesan from "views/pages/Pesan";
import DetailPesanan from "views/pages/DetailPesanan";
import Pembayaran from "views/pages/Pembayaran";
import Login from "views/pages/Login.js";
import Deposit from "views/pages/Deposit";
import Message from "views/pages/Message";



const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>

  <BrowserRouter>
    <Routes>
      <Route path="/admin/*" element={<Admin />} />
      <Route path="/auth/*" element={<AuthLayout />} />
      <Route path="/dashboard" element={<Admin/>}/>
      <Route path="/pesanan" element={<Pesan/>}/>
      <Route path="/pembayaran" element={<Pembayaran/>}/>
      <Route path="/admin/riwayat/:kodePesan" element={<DetailPesanan/>}/>
      {/* <Route path="/message" element={<Message/>}/> */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  </BrowserRouter>
  </React.StrictMode>
);


