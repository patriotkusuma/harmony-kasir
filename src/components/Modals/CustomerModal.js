import { useState, useEffect } from 'react'; // Pastikan useEffect diimpor
import { Button, Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";

const CustomerModal = ({
    isOpen,
    toggle,
    nama,
    setNama,
    telpon,
    setTelpon,
    pelanggan, // Sekarang akan selalu berupa array []
    onSelectCustomer,
    resetCustomer
}) => {
    const [hoveredCustomerId, setHoveredCustomerId] = useState(0);

    // Gunakan state ini untuk mengontrol tampilan search/selected
    const [isSearchingMode, setIsSearchingMode] = useState(false);

    const customerSelected = !!nama || !!telpon;

    useEffect(() => {
        // Saat modal dibuka, jika belum ada customer terpilih, masuk mode pencarian
        if (isOpen && !customerSelected) {
            setIsSearchingMode(true);
        } else if (!isOpen) {
            // Saat modal ditutup, reset mode pencarian
            setIsSearchingMode(false);
        }
    }, [isOpen, customerSelected]);

    const handleSelect = (customer) => {
        onSelectCustomer(customer);
        setIsSearchingMode(false); // Keluar dari mode pencarian setelah memilih
        // toggle(); // Anda bisa memilih untuk menutup modal otomatis di sini
    };

    const handleClearSelection = () => {
        resetCustomer(); // Ini akan mengosongkan nama, telpon, idPelanggan di useCustomer
        setIsSearchingMode(true); // Masuk mode pencarian untuk memungkinkan input baru
    };

    return (
        <Modal centered isOpen={isOpen} autoFocus={false} toggle={toggle}>
            <ModalHeader toggle={toggle}>Identitas Customer</ModalHeader>
            <ModalBody>
                {customerSelected && !isSearchingMode ? (
                    <div className="text-center mb-3">
                        <h4 className="text-primary">Customer Terpilih:</h4>
                        <h3 className="mb-0">{nama || 'N/A'}</h3>
                        <p className="lead">{telpon || 'N/A'}</p>
                        <Button color="warning" onClick={handleClearSelection} className="mt-2">
                            Ganti Customer
                        </Button>
                    </div>
                ) : (
                    <>
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Label className="form-label">Nama</Label>
                                    <Input
                                        className="form-control-alternative"
                                        name="nama"
                                        id="nama"
                                        placeholder="Nama Pelanggan"
                                        autoFocus={true} // Tetap autoFocus
                                        value={nama}
                                        onChange={(e) => setNama(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label className="form-label">Telpon / WA</Label>
                                    <Input
                                        className="form-control-alternative"
                                        name="telpon"
                                        id="telpon"
                                        placeholder="No Telpon / Wa"
                                        value={telpon}
                                        onChange={(e) => setTelpon(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>

                        {/* Tampilan saran pelanggan */}
                        <Col className="mt-2">
                            {/* Hanya tampilkan saran jika ada hasil dan sedang mencari */}
                            {isSearchingMode && pelanggan.length > 0 && (
                                <div className="mt-2">
                                    <h5>Saran Pelanggan:</h5>
                                    {pelanggan.map((plg) => (
                                        <Button
                                            key={plg.id}
                                            className="mt-1 mr-2"
                                            onClick={() => handleSelect(plg)}
                                            color={hoveredCustomerId === plg.id ? 'default' : 'white'}
                                            onMouseEnter={() => setHoveredCustomerId(plg.id)}
                                            onMouseLeave={() => setHoveredCustomerId(0)}
                                        >
                                            {`${plg.nama} ${plg.telpon}`}
                                            <br />
                                            <span>{plg.keterangan}</span>
                                        </Button>
                                    ))}
                                </div>
                            )}
                            {/* Kondisi untuk pesan loading/tidak ditemukan */}
                            {isSearchingMode && (nama || telpon) && pelanggan.length === 0 && (
                                <p className="text-muted mt-2">Tidak ada pelanggan ditemukan.</p>
                            )}
                            {isSearchingMode && !nama && !telpon && pelanggan.length === 0 && (
                                <p className="text-muted mt-2">Mulai ketik untuk mencari pelanggan.</p>
                            )}
                        </Col>
                    </>
                )}
            </ModalBody>
            <ModalFooter className="d-flex justify-content-between">
                <Button color="secondary" onClick={toggle}>
                    Batal
                </Button>
                <Button color="primary" onClick={toggle}> {/* Tombol OK/Simpan hanya menutup modal setelah interaksi */}
                    OK
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default CustomerModal;