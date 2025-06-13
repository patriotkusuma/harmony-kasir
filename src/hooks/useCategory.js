import { useState, useCallback, useMemo, useEffect } from 'react'; // Import useMemo
import axios from 'services/axios-instance';

const useCategory = (authenticated) => {
    const [category, setCategory] = useState(null);
    const [timer, setTimer] = useState(null);

    // Use useMemo for headers
    const headers = useMemo(() => ({
        Authorization: `Bearer ${authenticated}`,
    }), [authenticated]); // Dependency array: headers only changes if 'authenticated' changes

    const getCategory = useCallback(async (searchValue = '') => {
        if (!authenticated) return;
        try {
            const res = await axios.get('/category', {
                headers,
                params: { searchData: searchValue },
            });
            setCategory(res.data.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    }, [authenticated, headers]); // 'headers' is now a stable dependency

    const searchCategory = (value) => {
        clearTimeout(timer);
        const newTimer = setTimeout(() => {
            getCategory(value);
        }, 700);
        setTimer(newTimer);
    };
    
    useEffect(()=>{
        getCategory()
    }, [getCategory])
    return {
        category,
        getCategory,
        searchCategory,
    };
};

export default useCategory;