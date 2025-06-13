import React, { useContext, useEffect, useState } from "react";
import { useLocation, Route, Routes, Navigate, useNavigate } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";
import axios from "../services/axios-instance";
import DetailPesanan from "views/pages/DetailPesanan";
import Cookies from "js-cookie";
import { io } from "socket.io-client";
import { Bounce, ToastContainer, toast } from "react-toastify";
import Deposit from "views/pages/Deposit";
import { SocketContext } from "services/socket";

const Admin = (props) => {

  const [authenticated, setAuthenticated] = useState(localStorage.getItem("token")||null);
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [outlets, setOutlets] = useState(JSON.parse(localStorage.getItem('outlet')) || null)

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authenticated}`,
    };
  const navigate = useNavigate();

  const socket = useContext(SocketContext)
  // const socket = io("https://jutra.my.id/",{
  //   withCredentials:true,
  //   extraHeaders:{
  //     'my-custom-headers': 'abcd'
  //   },
  //   forceNew: true
  // })




  const checkUser = async () => {
      await axios.get('/user', {headers})
      .then((res) => {setAuth(res.data)
        Cookies.set('user', JSON.stringify(res.data))
        localStorage.setItem('user', JSON.stringify(res.data))
        window.location.reload()

      })
      .catch((err)=>{
          console.log(err)
          localStorage.removeItem("token");
          navigate('/auth/login');
      })
  }

  const waToast = (msg) => {
    toast.info(`${msg.phone} \n${msg.message}`, {
      transition: Bounce,
      autoClose: 10000,
    })
  }

  const getOutlet = async () => {
    await axios.get('/outlet', {
      headers
    }).then(res=>{
      localStorage.setItem('outlet', JSON.stringify(res.data.data))
    })
  }
  useEffect(()=>{
   if(auth === null){
    checkUser();
   }
   
   if(outlets === null){
    getOutlet()
   }
    if(authenticated == null){
      navigate('/auth/login')
    }
  },[authenticated, auth, outlets]);

  const selectCabang = async (id) => {
    await axios.post('/outlet', {
      id:id
    }, {headers}).then(res => {
      localStorage.setItem('outlet', JSON.stringify(res.data.data))
      checkUser()
    })
  }

  useEffect(()=>{
    socket.on('waMessage', (msg) => {
      waToast(msg)
    })

    return () => {
      socket.off('waMessage')
    }
  }, [socket])
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        // console.log(prop.path);
        
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props?.location?.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      <ToastContainer closeButton={true}/>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/admin/index",
          imgSrc: require("../assets/img/brand/harmony-blue.png"),
          imgAlt: "...",
        }}
        token={authenticated}
        user={auth}
        outlets={outlets}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          auth={auth}
          token={authenticated}
          outlets={outlets}
          selectCabang={selectCabang}
          brandText={getBrandText(props?.location?.pathname)}
        />
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/pesanan/:kodePesan" element={<Navigate to="/pesanan/:pesanan" replace/>}/>
          <Route path="/deposit" element={<Deposit/>} exact/>

        </Routes>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Admin;
