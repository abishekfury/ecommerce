
import axios from 'axios';
import { productFail, productRequest, productSuccess } from '../slices/productSlic';

export const getProduct = id => {
    return async (dispatch) => {
        try {
            dispatch(productRequest());

            const { data } = await axios.get(`/api/v1/product/${id}`);
            dispatch(productSuccess(data));
        } catch (error) {
            dispatch(productFail(error.response.data.message));
        }
    };
};
