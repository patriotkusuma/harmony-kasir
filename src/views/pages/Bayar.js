import axios from 'services/axios-instance'
import { CustomTable } from 'components/Table/CustomTable'
import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Container, Form, Input, InputGroup, Row } from 'reactstrap'
import RupiahFormater from 'utils/RupiahFormater'
import moment from 'moment'

const headRow = [
  "No",
  "Nama",
  "Tagihan",
  "Jumlah Dibayarkan",
  "Kembalian",
  "Tipe Bayar",
  "Tanggal Bayar"
]

const checkTipe = (tipe) => {
  switch (tipe) {
    case "qris":
      return (
        <span className='p-2 bg-green rounded text-white h4'>
          <i className="fas fa-qrcode"></i>
          <strong className='ml-2'>
          {tipe}
          </strong>
        </span>
      )
    case "cash":
      return (
        <span className='p-2 bg-warning rounded text-white h4'>
          <i className="fas fa-wallet"></i>
          <strong className='ml-2'>
          {tipe}
          </strong>
        </span>
      )
    case "tf":
      return (
        <span className='p-2 bg-default rounded text-white h4'>
          <i className="fas fa-exchange-alt"></i>
          <strong className='ml-2'>
          Transfer
          </strong>
        </span>
      )
  
    default:
      break;
  }
}

const namaComponent = (customer) => {
  return (
    <h4 className='text-default'>
      {customer.nama}
      <br/>
      <span className='text-primary h5'>{customer.telpon}</span>
    </h4>
  )
}

function Bayar() {
  const [payments, setPayments] = useState(null)
  const [authToken, setAuthToken] = useState(localStorage.getItem("token") || null)

  const getPayment= async(token) => {
    try{
      await axios.get("/transfer-payment", {
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      })
      .then((res) =>{
        setPayments(res.data.data)
      })
      .catch((err) => {console.log(err)})
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{

    if(payments === null && authToken !== null){
      getPayment(authToken)
      
    }

  }, [payments, authToken])
  
  console.log(payments)
  return (
    <>
        <header className='header bg-gradient-info pb-8 pt-5 pt-md-8'>
          <Container fluid>

          <Row className="gy-5">
            <Col lg="6" xl="3" className="mb-2">

                <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                        <Row>
                            <div className="col">
                                <CardTitle
                                    tag="h5"
                                    className="text-uppercase text-muted mb-0"
                                >
                                  TF Minggu Ini
                                </CardTitle>
                                <span className="h2 font-weight-bold mb-0">
                                    <RupiahFormater value={payments !== null ? payments.transferPayment : 0} />
                                </span>
                            </div>
                            <Col className="col-auto">
                                <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                                    <i className="fas fa-exchange-alt" />
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
              </Col>
            <Col lg="6" xl="3" className="mb-2">

                <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                        <Row>
                            <div className="col">
                                <CardTitle
                                    tag="h5"
                                    className="text-uppercase text-muted mb-0"
                                >
                                  Cash Minggu Ini
                                </CardTitle>
                                <span className="h2 font-weight-bold mb-0">
                                    <RupiahFormater value={payments !== null ? payments.cashPayment : 0} />
                                </span>
                            </div>
                            <Col className="col-auto">
                                <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                                    <i className="fas fa-wallet" />
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </header>

        <Container className='mt--7' fluid>
          <Card>
            <CardHeader className=''>
              <Row className='align-items-center'>
                <h3 className='mb-0'>Pembayaran dari Customer</h3>
              </Row>
            </CardHeader>
            <CardBody>
              <Row className='my-3' style={{'gap-y': '12px'}}>
                  <Col xs="12" lg="2">
                    <select 
                        // value={rowPerPage.current}
                        // onChange={(e) => {
                        //     currentPage.current = 1;
                        //     rowPerPage.current = e.target.value;
                        //     changedFilter();
                        // }}

                        className='form-control-alternative form-control form-control-select-sm mr-3'>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                    </select>
                    
                </Col>
                <Col xs="12" lg="2">
                    <select 
                        // value={status}
                        // onChange={(e) => {
                        //     setStatus(e.target.value)
                        //     currentPage.current = 1
                        // }}
                        className='form-control-alternative form-control form-control-select-sm mr-3'>
                        <option value="">Pilih Tipe</option>
                        <option value="cash">Cash</option>
                        <option value="tf">
                          <span className='p-2 bg-default rounded text-white h4'>
                            <i className="fas fa-exchange-alt"></i>
                            <strong className='ml-2'>
                            Transfer
                            </strong>
                          </span>
                        </option>
                        <option value="qris">QRIS</option>
                    </select>
                </Col>
                <Col xs="12" lg="2">
                    <InputGroup className='input-group-alternative'>
                        <InputGroup className='input-group-alternative'>
                            <Input
                                id='dateFrom'
                                name='dateFrom'
                                type='date'
                                // value={dateFrom ? dateFrom : ""}
                                // onChange={(e) => setDateFrom(e.target.value)}
                            />
                        </InputGroup>
                    </InputGroup>
                </Col>
                <Col xs="12" lg="3">
                    <InputGroup className='input-group-alternative'>
                        <InputGroup className='input-group-alternative'>
                            <Input
                                id='dateTo'
                                name='dateTo'
                                type='date'
                                // value={dateTo ? dateTo : ""}
                                // onChange={(e) => setDateTo(e.target.value)}
                            />
                        </InputGroup>
                    </InputGroup>
                </Col>
                <Col xs="12" lg="3">
                    <Form className='justify-content-between'>
                        <InputGroup className='input-group-alternative'>
                            <Input 
                                id='search'
                                name='search'
                                type='text'
                                // value={searchData ? searchData : ''}
                                // onChange={(e) => {
                                //     setSearchData(e.target.value)
                                //     currentPage.current=1
                                // }}
                                placeholder='Cari Disini'
                            />
                            <Button className='shadow-none border-none text-muted bg-transparent'
                            >
                                <i className='fa-solid fa-magnifying-glass'></i>
                            </Button>
                        </InputGroup>
                    </Form>
                </Col>
              </Row>

              {/* Table */}
              <CustomTable
                headData = {headRow}
                currentUrl = "/bayar"
              >
                {payments !== null && payments.payment.data.map((py, index) => {
                  return py.customer !== null && (
                    <tr key={py.id}>
                      <td>{index}</td>
                      <td>{namaComponent(py.customer)}</td>
                      <td>
                        <h4>
                          <RupiahFormater value={py.total_pembayaran}/>
                        </h4>
                      </td>
                      <td>
                        <h4>
                          <RupiahFormater value={py.nominal_bayar}/>
                        </h4>
                      </td>
                      <td>
                        <h4>
                          <RupiahFormater value={py.kembalian}/>
                        </h4>
                      </td>
                      <td>
                        <h2>
                          {checkTipe(py.tipe)}
                        </h2>
                      </td>
                      <td>
                        {moment(py.created_at).format('D MMMM Y')}
                      </td>
                    </tr>
                  )
                })}

              </CustomTable>
            </CardBody>
          </Card>
            
        </Container>
    </>
  )
}

export default Bayar