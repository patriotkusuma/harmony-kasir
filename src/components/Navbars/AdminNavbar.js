import { useEffect, useState } from "react";
import axios from "../../services/axios-instance";
import { Link, useNavigate } from "react-router-dom";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";
import Cookies from "js-cookie";

const AdminNavbar = (props) => {
  // const [token, setToken] = useState(localStorage.getItem('token')||null)

  // const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('user')) || null)
  const {auth, token, outlets, selectCabang} = props
  const headers = {
    'Authorization' : `Bearer ${token}`
  }

  console.log(outlets)
  const navigate = useNavigate();
  const logout = async() => {
    if(token !== null){
      await axios.post('https://api.harmonylaundry.my.id/user-logout', {headers})
        .then((res)=> {
          localStorage.clear()
          navigate('/auth/login')
         
        })
        .catch((res) => {
          console.log(res)
        })
        Cookies.remove()
        localStorage.clear()
      navigate('/auth/login')

    }
  }

  // const selectCabang = async (id) => {
  //   await axios.post('/outlet', {
  //     id:id
  //   }, {headers}).then(res => {
  //     localStorage.setItem('outlet', JSON.stringify(res.data.data))
  //     window.location.reload()
  //   })
  // }
  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>
          { auth !== null && auth.role !== "pegawai" && (  
          <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <FormGroup className="mb-0">
              <InputGroup className="input-group-alternative">
                {/* <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-search" />
                  </InputGroupText>
                </InputGroupAddon> */}
                <Input 
                  placeholder="Search" 
                  type="select"
                  onChange={(e) => selectCabang(e.target.value)}
                >
                  {outlets !== null  && outlets.outlets.map((olt,index) => (
                    <option className="bg-default" value={olt.id} selected={olt.id===outlets.active} key={index}>{olt.nama}</option>
                  ))}
                </Input>
              </InputGroup>
            </FormGroup>
          </Form>
          )}
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={require("../../assets/img/theme/team-4-800x800.jpg")}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {auth != null ? auth.name : "Jessica Jones"}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem  onClick={logout}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
