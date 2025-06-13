import React from 'react';
import { Card, CardBody, CardFooter, CardHeader, CardTitle, Col, ListGroup, ListGroupItem, Row, Badge } from 'reactstrap';
import RupiahFormater from 'utils/RupiahFormater'; // Pastikan path ini benar

const PayableOrderItem = ({ pesanan }) => {
  const kekurangan = pesanan.total_harga - pesanan.paid;
  return (
    <Card className="mb-3 shadow-sm">
      <CardHeader className="py-2 bg-light border-bottom"> {/* Mengasumsikan header mungkin memiliki bg-light atau default yang terang */}
        <CardTitle tag="h6" className="mb-0 d-flex justify-content-between align-items-center font-weight-bold text-dark"> {/* Mengganti text-primary menjadi text-dark */}
          <span>Kode Pesanan: {pesanan.kode_pesan}</span>
          {kekurangan <= 0 && <Badge color="success" pill className="px-3 py-1">Lunas</Badge>}
        </CardTitle>
      </CardHeader>
      <CardBody className="py-2">
        <ListGroup flush>
          {pesanan.detail_pesanan.map((detailPesan) => (
            <ListGroupItem key={detailPesan.id || detailPesan.jenis_cuci.id} className="px-3 py-2">
              <Row className="align-items-center">
                <Col xs="7" sm="8">
                  <div className="d-flex flex-column">
                    <span className="font-weight-bold text-dark">{detailPesan.jenis_cuci.nama}</span>
                    <small className="text-muted">
                      {detailPesan.qty}
                      {detailPesan.jenis_cuci.satuan === 'Kg' ? ' Kg' : (detailPesan.jenis_cuci.satuan === 'Pcs' ? ' Pcs' : ` ${detailPesan.jenis_cuci.satuan}`)}
                      {' x '}
                      <RupiahFormater value={detailPesan.jenis_cuci.harga} />
                    </small>
                  </div>
                </Col>
                <Col xs="5" sm="4" className="text-right">
                  <span className="font-weight-bold text-dark"><RupiahFormater value={detailPesan.total_harga} /></span>
                </Col>
              </Row>
            </ListGroupItem>
          ))}
        </ListGroup>
      </CardBody>
      <CardFooter className="py-3 bg-danger  border-top">
        <div className="d-flex justify-content-between mb-1">
          <span className="text-light">Subtotal</span>
          <strong className="text-light"><RupiahFormater value={pesanan.total_harga} /></strong>
        </div>
        <div className="d-flex justify-content-between mb-1">
          <span className="text-light">Telah Dibayar</span>
          <strong className="text-light"><RupiahFormater value={pesanan.paid} /></strong>
        </div>
        {kekurangan > 0 && (
          <>
            <hr className="my-2"/>
            <div className="d-flex  justify-content-between text-light mt-1">
              <strong style={{fontSize: '1.05rem'}}>Sisa Tagihan</strong>
              <strong style={{fontSize: '1.05rem'}}><RupiahFormater value={kekurangan} /></strong>
            </div>
          </>
        )}
        {kekurangan <= 0 && (
            <div className="text-right mt-2">
                <Badge color="success" style={{fontSize: '0.9rem'}}>Pembayaran Lunas</Badge>
            </div>
        )}
      </CardFooter>
    </Card>
  );
};



export default PayableOrderItem;
