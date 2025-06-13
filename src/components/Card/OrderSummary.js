import moment from "moment"
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap"
import RupiahFormater from "utils/RupiahFormater"

const OrderSummary = ({
        kodePesan, 
        nama, 
        telpon, 
        estimasi, 
        subTotal, 
        isLunas, 
        setIsLunas, 
        onEditCustomer, 
        onSubmitOrder,
        isOrderDisabled
    }) => {
    return (
        <>
           <Card className="mb-2">
                <CardHeader className="pb-2">
                    <Row className="d-flex align-items-center justify-content-between">
                        <Col xs="8">
                            <h3 className="mb-0">Identitas</h3>
                        </Col>
                        <Col className="text-right" xs="4">
                            <Button color="primary" size="sm" onClick={onEditCustomer}>
                                <i className="fa-solid fa-pen-to-square"></i>
                                <span>Edit</span>
                            </Button>
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col md="5">
                            <h4>Kode Pesan</h4>
                        </Col>
                        <Col md="7" className="text-right">
                            <h4>{kodePesan || ''}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="6">
                            <h4>Nama</h4>
                        </Col>
                        <Col md="6" className="text-right">
                            <h4>{nama || ''}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="6">
                            <h4>No Wa</h4>
                        </Col>
                        <Col md="6" className="text-right">
                            <h4>{telpon || ''}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="5">
                            <h4>Tanggal Masuk</h4>
                        </Col>
                        <Col md="7" className="text-right">
                            <h4>{moment().format('HH:mm, DD MMMM YYYY')}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="5">
                            <h4>Tanggal Selesai</h4>
                        </Col>
                        <Col md="7" className="text-right">
                            <h4>{moment(estimasi).format('HH:mm, DD MMMM YYYY')}</h4>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            <Row className="mb-2">
                <Col>
                    <Button className="w-100" color={!isLunas ? 'success' : 'white'} onClick={() => setIsLunas(false)}>
                        Belum Lunas
                    </Button>
                </Col>
                <Col>
                    <Button className="w-100" color={isLunas ? 'success' : 'white'} onClick={() => setIsLunas(true)}>
                        Lunas
                    </Button>
                </Col>
            </Row>
            <Button
                disabled={isOrderDisabled}
                className="w-100"
                color="default"
                onClick={onSubmitOrder}
            >
                <Row className="d-flex justify-content-between">
                    <Col md="4" className="text-left">
                        <span>Bayar</span>
                        <i className="fa-solid fa-arrow-right"></i>
                    </Col>
                    <Col md="8" className="text-right">
                        <RupiahFormater value={subTotal} />
                    </Col>
                </Row>
            </Button>
        </>
    )
}

export default OrderSummary