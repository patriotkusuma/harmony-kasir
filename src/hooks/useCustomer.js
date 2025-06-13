import axios from 'services/axios-instance'
import  { useCallback, useEffect, useMemo, useState } from 'react'
import { debounce } from 'lodash'

const useCustomer = (authenticated) => {
    const [nama, setNama] = useState('')
    const [telpon, setTelpon] = useState('')
    const [idPelanggan, setIdPelanggan] = useState(null)
    const [pelanggan, setPelanggan] = useState([]) // Inisialisasi dengan array kosong []

    const headers = useMemo(()=>({
        Authorization: `Bearer ${authenticated}`
    }), [authenticated])

    const searchCustomersDebounced = useCallback(
        debounce(async (queryNama, queryTelpon) => {
            // HANYA LAKUKAN PENCARIAN JIKA ADA QUERY YANG TIDAK KOSONG
            if(!authenticated || (!queryNama && !queryTelpon)){
                setPelanggan([]); // Set ke array kosong jika tidak ada query
                return;
            }

            try{
                const params = {};
                if (queryNama) params.nama = queryNama;
                if (queryTelpon) params.telpon = queryTelpon;

                const res = await axios.get('pelanggan', { params, headers });
                setPelanggan(res.data.data);
            }catch(err){
                console.error(`Error fetching customer data: ${err}`);
                setPelanggan([]); // Set ke array kosong saat error
            }

        }, 500),
        [authenticated, headers]
    );

    const selectCustomer = useCallback((customer) => {
        setNama(customer.nama);
        setTelpon(customer.telpon);
        setIdPelanggan(customer.id);
        setPelanggan([]); // Kosongkan saran setelah memilih
    }, []);

    const resetCustomer = useCallback(() => {
        setNama('');
        setTelpon('');
        setIdPelanggan(null);
        setPelanggan([]); // Kosongkan saran saat reset
    }, []);

    useEffect(()=>{
        // Panggil fungsi yang sudah di-debounce dengan nama dan telpon terbaru
        searchCustomersDebounced(nama, telpon);
    }, [nama, telpon, searchCustomersDebounced]);

    useEffect(() => {
        // Cleanup function untuk membatalkan debounce timer
        return () => {
            if (searchCustomersDebounced.cancel) { // Pastikan debounce memiliki metode cancel
                searchCustomersDebounced.cancel();
            }
        };
    }, [searchCustomersDebounced]);

    return {
        nama,
        setNama,
        telpon,
        setTelpon,
        idPelanggan,
        setIdPelanggan,
        pelanggan,
        selectCustomer,
        resetCustomer,
    };
};

export default useCustomer;