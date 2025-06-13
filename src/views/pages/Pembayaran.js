import axios from 'services/axios-instance';
import Order from 'layouts/Order'
import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Modal, Row } from 'reactstrap'
import RupiahFormater from 'utils/RupiahFormater';
import { useMemo } from 'react';

// Suggested new components (create these files in a 'components/Pembayaran' or similar directory)
import CustomerListItem from 'components/Card/CustomerListItem'; // Placeholder path
import SelectedCustomerDetails from 'components/Card/SelectedCustomerDetails'; // Placeholder path
import PaymentModalContent from 'components/Modals/PaymentModalContent'; // Placeholder path

const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const removeNonNumeric = (num) => num.toString().replace(/[^0-9,.]/g, "").replace(/,/g, ".");

function Pembayaran() {
  const [authenticated, setAuthenticated] = useState(localStorage.getItem('token') || null)
  const [dataCustomer, setDataCustomer] = useState(null);
  const [filtered, setFiltered] = useState(null)
  const [bukti,setBukti] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [valueBayar, setValueBayar] = useState('') // Store as string for easier input handling
  const [timer, setTimer] = useState(null)
  const [tipeBayar, setTipeBayar] = useState('cash');
  const headers = {
    'Authorization' : `Bearer ${authenticated}`
  }

  const customerChecked = (data) => {
    if(filtered?.id === data.id){
      setFiltered(null)
    }else{
      setFiltered(data)
    }
  } 

  const getCustomer = async(search='') => {
    clearTimeout(timer)

    const newTimer = setTimeout(async()=> {
      let data = await axios.get(`/pelanggan-bayar?search=${search}`, {headers})
      setDataCustomer(data.data.customer)
    },500)
    setTimer(newTimer)
  }

  const handleOpenModal = () => {
    if (filtered) {
      const amountDue = filtered.totalBayar - filtered.telahBayar;
      setValueBayar(amountDue > 0 ? removeNonNumeric(amountDue.toString()) : '');
    }
    setTipeBayar('cash');
    setBukti(null); // Preview will clear via useEffect
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    // Reset modal specific states if needed when closing without submission
  };

  useEffect(()=> {
    if(authenticated != null && dataCustomer == null){
      getCustomer()
    }
  }, [authenticated, dataCustomer]) // Added dataCustomer to dependencies to avoid potential issues if it's set to null elsewhere

  useEffect(()=>{
    if(!bukti){
      setPreview(undefined)
      return
    }
    const objectURL = URL.createObjectURL(bukti)
    setPreview(objectURL) // Corrected to set the object URL for preview

    return ()=> URL.revokeObjectURL(objectURL)
  }, [bukti])

  const submit = async() => {
     await axios.post(`/pesanan-bayar/${filtered.id}`, {
        tipeBayar: tipeBayar,
        valueBayar: parseFloat(removeNonNumeric(valueBayar.toString() || "0")),
        bukti: bukti // Send bukti if tipeBayar is 'tf' or 'qris'
      }, { headers: {...headers, ...(bukti && (tipeBayar === 'tf' || tipeBayar === 'qris') && {'Content-Type': 'multipart/form-data'})} }) // Adjust headers for file upload

    getCustomer();
    setFiltered(null);
    setIsOpen(false); // Close modal
    setValueBayar(''); // Reset form state
    setTipeBayar('cash');
    setBukti(null);
  }

    const updateStatus = async(e,currStatus) =>{
      try{

        // Consider batching these updates if the backend supports it
        const updatePromises = e.pesanan_takable.map((pesanan) => {
          return axios.post(`/order/${pesanan.kode_pesan}`, {
            status: currStatus,
            _method: 'patch'
          }, {headers});
        });

        await Promise.all(updatePromises);
        
          getCustomer()
          setFiltered(null)
      }catch(err){
          console.error("Error updating status:", err)
      }
  }

  const totalBlmBayar = useMemo(() => {
    return dataCustomer?.reduce((prev, current) => {
      return prev + +current.totalBayar - current.telahBayar;
    }, 0) ?? 0;
  }, [dataCustomer]);

  return (
    <Order>
      <Row className='justify-content-center'>
        <Col md="8">
          <Card>
            <CardHeader title='Daftar Customer Belum Bayar'>
              <CardTitle tag={"h3"}>
                <Row>
                  <Col md="7">
                    <span className='mb-2'>
                      Customer Belum Bayar
                    </span>
                    <br/> 
                    <br/> 
                    <span className='p-2 bg-danger rounded text-white'>
                      <RupiahFormater value={totalBlmBayar} />
                    </span>
                  </Col>
                  <Col md="5">
                    <Input
                      name='nama'
                      id='nama'
                      autoFocus={true}
                      placeholder='Cari Nama'
                      onChange={(e) => getCustomer(e.target.value)}
                    />
                  </Col>
                </Row>
              </CardTitle>
            </CardHeader>
            <CardBody className='bg-secondary'>
              <div style={{ maxHeight: '75vh', overflowY: 'auto' }}> {/* Better scroll control */}
                <Row>
                  {dataCustomer === null ? (
                    <Col xs="12" className="text-center"><p>Memuat data customer...</p></Col>
                  ) : dataCustomer.length === 0 ? (
                    <Col xs="12"><Card><CardBody className="text-center">Tidak ada customer yang belum bayar ditemukan.</CardBody></Card></Col>
                  ) : (
                    dataCustomer.map((customer) => (
                      <CustomerListItem
                        key={customer.id}
                        customer={customer}
                        isSelected={filtered?.id === customer.id}
                        onClick={customerChecked}
                      />
                    ))
                  )}
                </Row>
              </div>
            </CardBody>
          </Card>
        </Col>
        {/* Right Column */}
        <Col md="4" className=''>
          <SelectedCustomerDetails
            customer={filtered}
            onOpenPaymentModal={handleOpenModal}
            onMarkAsTaken={updateStatus}
          />
        </Col>
      </Row>
      
      {/* Payment Modal */}
      <Modal centered isOpen={isOpen} toggle={handleCloseModal} autoFocus={false} size="md" scrollable={true}>
        {/* ModalHeader can be part of PaymentModalContent or here */}
        {/* <ModalHeader toggle={handleCloseModal}>Pembayaran</ModalHeader> */}
        <PaymentModalContent
          isOpen={isOpen}
          toggleModal={handleCloseModal}
          filteredCustomer={filtered}
          valueBayar={valueBayar}
          setValueBayar={setValueBayar}
          tipeBayar={tipeBayar}
          setTipeBayar={setTipeBayar}
          bukti={bukti}
          setBukti={setBukti}
          preview={preview}
          onSubmit={submit}
          addCommas={addCommas}
          removeNonNumeric={removeNonNumeric}
        />
      </Modal>
    </Order>
  )
}

export default Pembayaran