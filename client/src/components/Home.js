import { Fragment } from "react/jsx-runtime";
import MetaData from "../components/layouts/MetaData";
import { useEffect } from "react";
import { getProducts } from "../actions/productsActions";
import { useDispatch, useSelector } from "react-redux"
import Loader from "./layouts/Loader";
import Product from "./product/Product";
import { toast } from 'react-toastify'

export default function Home() {

  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.productsState)

  useEffect(() => {
    dispatch(getProducts());
  }, []);

  
  useEffect(() => {
    if (error) {
      return toast.error(error, {
        position: "bottom-center",
      });
    }
  }, [error]);

  return (
    <Fragment>
      {loading ? <Loader /> :
        <Fragment>
          <MetaData title={'Buy Best Products'} />
          <section id="products" className="container mt-5">
            <div className="row">
              {products && products.map(product => (
                <Product product={product} />
              ))}
            </div>
          </section>

        </Fragment >
      }
    </Fragment>
  )
}