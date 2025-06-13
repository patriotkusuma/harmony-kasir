import React from 'react';
import { Card, CardBody, CardHeader, CardImg, Col, FormGroup, Label, Row, Badge, Button, Input } from 'reactstrap'; // Import Button and Input
import moment from 'moment';
import RupiahFormater from 'utils/RupiahFormater';

const PesananInfoCard = ({ pesanan, kodePesan, updateNama }) => {
  return (
    <Card className="bg-secondary shadow">
      <CardHeader>
        <Row className="align-items-center">
          <Col xs="8">
            <h3 className="mb-0 font-weight-light">
              Pesanan
              <strong className="ml-2 font-weight-bold">
                {kodePesan}
              </strong>
            </h3>
            <Badge color={pesanan.status === 'cuci' ? 'warning' : (pesanan.status === 'selesai' ? 'success' : 'default')} className="mt-2">
              Status: {pesanan.status.charAt(0).toUpperCase() + pesanan.status.slice(1)}
            </Badge>
          </Col>
          <Col xs="4" className="text-right">
            <strong className="font-weight-bold p-2 bg-danger text-white rounded-lg" style={{ fontSize: '1.1rem' }}>
              <RupiahFormater value={pesanan.total_harga} />
            </strong>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        {/* Pengerjaan Section */}
        <h6 className="heading-small text-muted">Pengerjaan</h6>
        <Row className="pl-md-3">
          <Col md="6">
            <FormGroup>
              <Label className="form-control-label">
                Tanggal Masuk
              </Label>
              <h4>
                {pesanan &&
                  moment(pesanan.tanggal_pesan).format(
                    "HH: mm, DD MMMM YYYY"
                  )}
              </h4>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label className="form-control-label">
                Tanggal Keluar
              </Label>
              <h4>
                {pesanan &&
                  moment(pesanan.tanggal_selesai).format(
                    "HH:mm, DD MMMM YYYY"
                  )}
              </h4>
            </FormGroup>
          </Col>
        </Row>

        <hr className="my-4" />

        {/* Pelanggan Section - Moved back here */}
        <h6 className="heading-small text-muted d-flex justify-content-between align-items-center">
          Informasi Pelanggan
          {/* Assuming updateNama is passed down or handled in parent */}
          <Button color="primary" size="sm" onClick={() => updateNama(pesanan)}>
            <i className="fas fa-save mr-1"></i> Simpan
          </Button>
        </h6>
        {/* Input fields for customer details - Assuming state and update functions are in parent */}
        {pesanan && pesanan.customer && (
          <Row className="pl-md-3">
            <Col md="6">
              <FormGroup>
                <Label className="form-control-label" htmlFor="input-nama-pelanggan">Nama</Label>
                <Input
                  className="form-control-alternative"
                  id="input-nama-pelanggan"
                  defaultValue={pesanan.customer.nama}
                  // onChange={(e) => setNamaPelanggan(e.target.value)} // Handled in parent
                  placeholder="Nama Pelanggan"
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label className="form-control-label" htmlFor="input-telpon-pelanggan">No. WhatsApp</Label>
                <Input
                  className="form-control-alternative"
                  id="input-telpon-pelanggan"
                  defaultValue={pesanan.customer.telpon}
                  // onChange={(e) => setTelpon(e.target.value)} // Handled in parent
                  placeholder="08xxxxxxxxxx"
                />
              </FormGroup>
            </Col>
            <Col md="12">
              <FormGroup>
                <Label className="form-control-label" htmlFor="input-keterangan-pelanggan">Keterangan Tambahan</Label>
                <Input
                  className="form-control-alternative"
                  id="input-keterangan-pelanggan"
                  type="textarea" rows="2"
                  defaultValue={pesanan.customer.keterangan}
                  // onChange={(e) => setKeterangan(e.target.value)} // Handled in parent
                  placeholder="Misal: Pelanggan VIP, Alamat Antar, dll."
                />
              </FormGroup>
            </Col>
          </Row>
        )}

        <hr className="my-4" />
        

        {/* Pesanan Items Section */}
        <h6 className="heading-small text-muted">Item Pesanan</h6>

        {pesanan &&
          pesanan.detail_pesanan.map(
            (detailPesanan, detailIndex) => {
              return (
                <Row key={detailIndex} className="mb-3"> {/* Added key and margin-bottom */}
                  <Col md="7">
                    <div className="d-flex align-items-center">
                      <CardImg
                        className="rounded-lg"
                        style={{
                          width: "80px",
                          height: "80px", // Added height for consistency
                          objectFit: 'cover' // Added object-fit
                        }}
                        src={detailPesanan.jenis_cuci.gambar || "https://harmonylaundrys.com/img/logo-harmony.png"} // Added placeholder
                        alt={detailPesanan.jenis_cuci.nama}
                      />
                      <h4 className="d-flex flex-column w-full text-dark ml-2 mb-0"> {/* Adjusted margin-bottom */}
                        <span className="text-default text-sm"> {/* Reduced font size */}
                          {
                            detailPesanan.jenis_cuci.category_paket
                              .nama
                          }
                        </span>
                        <span className="font-weight-bold">{detailPesanan.jenis_cuci.nama}</span> {/* Made name bold */}
                        <span className="text-muted text-sm"> {/* Reduced font size and made muted */}
                          {detailPesanan.qty}
                          <span className="mx-1">x</span> {/* Reduced margin */}
                          <RupiahFormater
                            value={detailPesanan.harga}
                          />
                        </span>
                      </h4>
                    </div>
                  </Col>

                  <Col
                    md="5"
                    className="d-flex align-items-center justify-content-end" // Adjusted alignment
                  >
                    <h4 className="mb-0"> {/* Adjusted margin-bottom */}
                      <RupiahFormater
                        value={detailPesanan.total_harga}
                      />
                    </h4>
                  </Col>
                </Row>
              );
            }
          )}
      </CardBody>
    </Card>
  );
};

export default PesananInfoCard;