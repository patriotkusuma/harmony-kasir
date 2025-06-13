import { useState, useCallback, useEffect, useMemo } from 'react';
import axios from 'services/axios-instance';
import moment from 'moment';

const useChart = (authenticated) => {
    const [cartItems, setCartItems] = useState(null)
    const [estimasi, setEstimasi] = useState(moment())
    const [subTotal, setSubTotal] = useState(0)
    const [timer, setTimer] = useState(null)

    const headers = useMemo(() => ({
        Authorization: `Bearer ${authenticated}`,
    }), [authenticated])

    const getCart = useCallback(async() => {
        if(!authenticated) return
        try{
            const res = await axios.get('/paket-cart', {headers})
            setCartItems(res.data.data.cart_items)
            setEstimasi(res.data.data.estimasiSelesai)
            setSubTotal(res.data.data.subTotal)
        }catch(err){
            console.log(`Error fetching data ${err}`)
        }
    }, [authenticated, headers])

    const addCart = async(packageID) => {
        try{
            await axios.post('/paket-cart', { idJenisCuci: packageID }, { headers })
            getCart()
        }catch(err){
            console.log(`Error fetching data ${err}`)
        }
    }

    const updateCart = (value, id) => {
        clearTimeout(timer)
        const newTimer = setTimeout(async () => {
            try{
                await axios.patch(`/paket-cart/${id}`, {qty:value}, {headers})
                getCart()
            }catch(err){    
                console.log(`Error fetching data ${err}`)
            }
        }, 500)
        setTimer(newTimer)
    }

    const removeOneCart = async (item) =>{
        try{
            await axios.delete(`/paket-cart/${item.id}`, {headers})
            getCart()
        }catch(err){
            console.log(`Error fetchig data ${err}`)
        }
    }

    const clearCart = () => {
        setCartItems(null)
        setSubTotal(0)
        setEstimasi(null)
    }

    useEffect(()=>{
        getCart()
    }, [getCart])
    
    return {
        cartItems,
        estimasi,
        subTotal,
        addCart,
        updateCart,
        removeOneCart,
        clearCart,
        getCart
    }
}

export default useChart