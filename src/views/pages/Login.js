import Cookies from "js-cookie";
import axios from "../../services/axios-instance";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Row,
    Col,
  } from "reactstrap";

  
  const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passShow, setPassShow] = useState(false);
    const [authenticated, setAuthenticated] = useState(localStorage.getItem("token")||false);

    const navigate = useNavigate();

    // const token = "2|2apMJHeXa1nNxMe6c6QW7sI7Z0DzfBBNR7J2PY6222866865"
    const headers = {
        "Content-Type": "application/json",
        withCredentials: true,
        "Access-Control-Allow-Origin": "*"
    }

    useEffect(()=>{
        if(authenticated){
            navigate('/dashboard');
        }
    }, [authenticated]);
    // };

    const form = {
        email: email,
        password: password
    }


    // Login
    const loginHandler = async (e) => {
        e.preventDefault();
        await axios.post('/login', form, {headers})
        .then((response) => {
                localStorage.setItem("token", response.data.data.token)

                Cookies.set('token',response.data.data.token,{
                  expires:7,
                  secure:true,
                  path: '/',
                });
                navigate('/admin/index', {
                  replace:true,
                  preventScrollReset:true,
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }
    
    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
    
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <small>Masukkan Email dan Password</small>
              </div>
              <Form role="form" onSubmit={loginHandler}>
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email"
                      type="email"
                      autoComplete="new-email"
                      name="email"
                      value={email}
                      onChange={(e) => {setEmail(e.target.value)}}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Password"
                      type={passShow === true? 'text' : 'password'}
                      autoComplete="new-password"
                      name="passwword"
                      value={password}
                      onChange={(e)=>setPassword(e.target.value)}
                    /> 
                    <InputGroupAddon addonType="prepend" style={{cursor:'pointer'}} onClick={() => setPassShow(!passShow)}>
                      <InputGroupText>
                        <i className="fa-solid fa-eye"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </FormGroup>
                <div className="custom-control custom-control-alternative custom-checkbox">
                  <input
                    className="custom-control-input"
                    id=" customCheckLogin"
                    type="checkbox"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor=" customCheckLogin"
                  >
                    <span className="text-muted">Remember me</span>
                  </label>
                </div>
                <div className="text-center">
                  <Button className="my-4" color="primary" type="submit">
                    Sign in
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
          <Row className="mt-3">
            <Col xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <small>Forgot password?</small>
              </a>
            </Col>
            <Col className="text-right" xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <small>Create new account</small>
              </a>
            </Col>
          </Row>
        </Col>
      </>
    );
  };
  
  export default Login;
  