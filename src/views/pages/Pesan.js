import React, { useState, useCallback, useMemo } from 'react';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row } from 'reactstrap';
import Order from 'layouts/Order';
import moment from 'moment';
import axios from 'services/axios-instance';

// Hooks
import useCart from 'hooks/useChart';
import useCategory from 'hooks/useCategory';
import useCustomer from 'hooks/useCustomer';
import useHotkeys from 'hooks/useHotKeys';

// Components
import PackageCard from 'components/Card/PackageCard';
import CartSummary from 'components/Card/CartSummary';
import OrderSummary from 'components/Card/OrderSummary';
import CustomerModal from 'components/Modals/CustomerModal';
import PaymentModal from 'components/Modals/PaymentModal';

const Pesan = () => {
    const authenticated = useState(localStorage.getItem('token') || null)[0];
    const kode_pesan = `HRMN-${moment().unix()}`;
    const headers = useMemo(() => ({
        Authorization: `Bearer ${authenticated}`,
    }), [authenticated])

    // Use Custom Hooks
    const { cartItems, estimasi, subTotal, addCart, updateCart, removeOneCart, clearCart, getCart } = useCart(authenticated);
    const { category, searchCategory } = useCategory(authenticated);
    const { nama, setNama, telpon, setTelpon, idPelanggan, pelanggan, selectCustomer, resetCustomer } = useCustomer(authenticated);

    // Local State
    const [isLunas, setIsLunas] = useState(false);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [valueBayar, setValueBayar] = useState(0);

    // API Calls (for order submission and printing)
    const printOrder = async (data) => {
        try {
            await axios.post('https://printer.test/last_order.php', { data: JSON.stringify(data) });
        } catch (err) {
            console.error('Error printing order:', err);
        }
    };

    const printLastOrder = async (data) => {
        try {
            await axios.post('https://printer.test/last_order.php', { data: JSON.stringify(data) });
        } catch (err) {
            console.error('Error printing last order:', err);
        }
    };

    const fetchAndPrintLastOrder = useCallback(async () => {
        try {
            const res = await axios.get('/last-order', { headers });
            printLastOrder(res.data.data.pesanan);
        } catch (err) {
            console.error('Error fetching last order:', err);
        }
    }, [headers]);

    const submitOrder = async () => {
        try {
            const res = await axios.post('/order', {
                id_pelanggan: idPelanggan,
                kodePesan: kode_pesan,
                nama: nama,
                telpon: telpon,
                statusPembayaran: isLunas ? 'Lunas' : 'Belum Lunas',
                subTotal: subTotal,
                totalBayar: valueBayar !== 0 ? valueBayar : 0,
            }, { headers });

            printOrder(res.data.data);
            clearCart(); // Reset cart using the hook
            resetCustomer(); // Reset customer using the hook
            setValueBayar(0); // Reset payment amount
            setIsCustomerModalOpen(false); // Close customer modal
            setIsPaymentModalOpen(false); // Close payment modal
        } catch (err) {
            console.error('Error submitting order:', err);
        }
    };

    // Hotkeys configuration
    const hotkeyMap = {
        openCustomerModal: { keyCode: 113, handler: () => setIsCustomerModalOpen(true) }, // F2
        printLastOrder: { keyCode: 114, handler: fetchAndPrintLastOrder, preventDefault: true }, // F3
        // If F4 (keyCode 115) should have distinct functionality, add it here
        closeModals: { keyCode: 27, handler: () => {
            setIsCustomerModalOpen(false);
            setIsPaymentModalOpen(false);
        }}, // Escape
    };
    useHotkeys(hotkeyMap);

    // Handlers for modals
    const toggleCustomerModal = useCallback(() => setIsCustomerModalOpen(prev => !prev), []);
    const togglePaymentModal = useCallback(() => setIsPaymentModalOpen(prev => !prev), []);

    // Main submit handler (triggered by OrderSummary component)
    const handleOrderSubmission = () => {
        if (isLunas) {
            setIsPaymentModalOpen(true);
        } else {
            submitOrder();
        }
    };

    const isOrderButtonDisabled = !nama || !cartItems || Object.keys(cartItems).length === 0;

    return (
        <Order>
            <Row className="justify-content-center">
                {/* Left Column: Laundry Packages */}
                <Col md="8">
                    <Card>
                        <CardHeader>
                            <CardTitle tag="h3">
                                <Row>
                                    <Col md="7">Daftar Paket Laundry</Col>
                                    <Col md="5">
                                        <Input
                                            name="search"
                                            id="search"
                                            autoFocus={true}
                                            placeholder="Cari Paket Cuci"
                                            onChange={(e) => searchCategory(e.target.value)}
                                            // Value is not directly controlled here, searchCategory handles internal timer
                                        />
                                    </Col>
                                </Row>
                            </CardTitle>
                        </CardHeader>
                        <CardBody className="bg-secondary">
                            {/* <div className="overflow-scroll" style={{ maxHeight: '70vh' }}> */}
                            <div>
                                {category && category.map((categoryPaket) => (
                                    <React.Fragment key={categoryPaket.id}>
                                        <h3 className="heading-medium text-muted">
                                            {`${categoryPaket.nama} ${categoryPaket.durasi} ${categoryPaket.tipe_durasi}`}
                                        </h3>
                                        <Row className="mb-3">
                                            {categoryPaket.paket_cuci && categoryPaket.paket_cuci.map((paket) => (
                                                <PackageCard
                                                    key={paket.id}
                                                    paket={paket}
                                                    isAddedToCart={cartItems && cartItems[paket.id] !== undefined}
                                                    onAddCart={addCart}
                                                />
                                            ))}
                                        </Row>
                                    </React.Fragment>
                                ))}
                                {!category && <p className="text-center">Loading categories or no categories found...</p>}
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                {/* Right Column: Cart and Order Summary */}
                <Col md="4" className="order-first order-md-last">
                    <CartSummary
                        cartItems={cartItems}
                        subTotal={subTotal}
                        onUpdateCart={updateCart}
                        onRemoveCart={removeOneCart}
                        onClearCart={clearCart}
                    />
                    <OrderSummary
                        kodePesan={kode_pesan}
                        nama={nama}
                        telpon={telpon}
                        estimasi={estimasi}
                        subTotal={subTotal}
                        isLunas={isLunas}
                        setIsLunas={setIsLunas}
                        onEditCustomer={toggleCustomerModal}
                        onSubmitOrder={handleOrderSubmission}
                        isOrderDisabled={isOrderButtonDisabled}
                    />
                </Col>
            </Row>

            {/* Modals */}
            <CustomerModal
                isOpen={isCustomerModalOpen}
                toggle={toggleCustomerModal}
                nama={nama}
                setNama={setNama}
                telpon={telpon}
                setTelpon={setTelpon}
                pelanggan={pelanggan}
                onSelectCustomer={selectCustomer}
                resetCustomer={resetCustomer} 
            />

            <PaymentModal
                isOpen={isPaymentModalOpen}
                toggle={togglePaymentModal}
                valueBayar={valueBayar}
                setValueBayar={setValueBayar}
                subTotal={subTotal}
                onSubmitPayment={submitOrder}
            />
        </Order>
    );
};

export default Pesan;