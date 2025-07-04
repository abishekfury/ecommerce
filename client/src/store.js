import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import productsReducer from './slices/productsSlice'
import productReducer from './slices/productSlic';


const reducer = combineReducers({
  productsState: productsReducer,
  productState: productReducer

});

const store = configureStore({
  reducer,
  middleware: [thunk],
});

export default store;
