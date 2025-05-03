import axios from "axios";

// Create product
const createProduct = async (inputValues) => {
    try {
        const axiosResponse = await axios.post(
            `${import.meta.env.VITE_API_URL}/create-product`,
            inputValues,
            {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' },
            }


        );
        return axiosResponse.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || error.message || 'Something went wrong';
        return Promise.reject(errorMessage);
    }
};

// all product
const allProduct = async (category = 'all', searchTerm = '') => {
    try {
        const axiosResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/get-products`
            ,
            {
                params: { category, search: searchTerm },
                withCredentials: true,
                headers: { 'Content-Type': 'application/json', },
            }


        );
        return axiosResponse.data?.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || error.message || 'Something went wrong';
        return Promise.reject(errorMessage);
    }
};

// single product
const getSingleProd = async (id) => {
    try {
        const axiosResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/single-product/${id}`
            ,
            {

                withCredentials: true,
                headers: { 'Content-Type': 'application/json', },
            }


        );
        return axiosResponse.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || error.message || 'Something went wrong';
        return Promise.reject(errorMessage);
    }
};


// upadate product
const updateProd = async ({ inputValues, id }) => {
    try {
        const axiosResponse = await axios.put(
            `${import.meta.env.VITE_API_URL}/update-product/${id}`
            ,
            inputValues
            ,
            {

                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' },
            }


        );
        return axiosResponse.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || error.message || 'Something went wrong';
        return Promise.reject(errorMessage);
    }
};

<<<<<<< HEAD
=======

>>>>>>> fb2e911b0f8a9fc050f3f6a9b045faf3b37004e0
// delete product
const deleteProduct = async (id) => {
    try {
        const axiosResponse = await axios.delete(
            `${import.meta.env.VITE_API_URL}/delete-product/${id}`,
            {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        return axiosResponse.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || error.message || 'Something went wrong';
        return Promise.reject(errorMessage);
    }
};

<<<<<<< HEAD
const productService = { createProduct, allProduct, getSingleProd, updateProd,deleteProduct };
=======

const productService = { createProduct, allProduct, getSingleProd, updateProd, deleteProduct };
>>>>>>> fb2e911b0f8a9fc050f3f6a9b045faf3b37004e0

export default productService;