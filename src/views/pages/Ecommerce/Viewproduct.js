import React, { useState, useEffect } from "react";
import { isAuthenticated } from "api/auth";

//React-Strap
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  Label,
  Input,
  Button,
  CardHeader,
  Table,
  CardImg,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { addItemsToCart } from "../../../store/reducers/cart";
// core components
import { toast, ToastContainer } from "react-toastify";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { cartItems } from "./productList";
//import CSS
import "./Ecommerce.css";
import ProductDetails from "./ProductDetails";
//Add to cart
import Addtocart from "./Addtocart";
import { getAllProducts } from "api/product";

function Viewproduct() {
  const dispatch = useDispatch();
  const { user } = isAuthenticated();
  const [view, setView] = useState(1);
  const [checked, setChecked] = useState(false);
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setselectedProduct] = useState({});
  const { cartTotalQuantity, cartItems } = useSelector(
    (state) => state.cartReducer
  );
  const [loading, setLoading] = useState(false);
  const addToCart = (product) => {
    let item = {
      id: product._id,
      name: product.name,
      price: product.offerPrice,
      image: product.image,
      quantity: 1,
      stock: product.quantity,
      product:product._id,
    };
    console.log(product);
    console.log(item);
    dispatch(addItemsToCart(item));
    toast.success(`${product.name} added to Cart`)
  };

  useEffect(() => {
    getAllProductsHandler();
  }, [checked]);

  const getAllProductsHandler = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts(user._id, user.school);
      console.log(data);
      if (data.err) {
        setLoading(false);
        toast.error(data.err);
        return;
      }
      setProductList(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Getting products failed");
    }
  };

  const viewProductDetail = async (product) => {
    console.log("clicked");
    setView(2);
    setselectedProduct(product);
  };

  const Cart = (e) => {
    setChecked(true);
  };
  const backHandler = () => {
    setView(1);
  };
  const cartBackHandler = () => {
    setChecked(false);
  };
  return (
    <>
      <SimpleHeader name="View Products" parentName="Ecommerce" />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div>
        {checked ? (
          <Addtocart handleCartBack={cartBackHandler} />
        ) : (
          <>
            <Container className="mt--6" fluid>
              <Row>
                <Col className="mt--3 ">
                  <Button
                    className="float-right"
                    color="success"
                    onClick={Cart}
                  >
                    <i className="ni ni-cart">Cart</i>
                    <span>{cartItems && cartItems.length}</span>
                  </Button>
                </Col>
              </Row>
              {view && view === 1 && (
                <div className="items ">
                  {productList &&
                    productList.map((product, index) => {
                      if (product.publish === "Yes") {
                        return (
                          <Card className="mt-4" key={index}>
                            <CardBody
                              onClick={() => viewProductDetail(product)}
                              style={{ cursor: "pointer", padding: "0" }}
                            >
                              <CardImg
                                alt="..."
                                src={product.image && product.image}
                                top
                                className="p-4"
                                style={{ width: "100%", height: "100%" }}
                              />
                              <div className="mb-3 ml-2 d-flex justify-content-between">
                                <div>
                                  <h2 className="ml-3">{product.name}</h2>
                                </div>
                                <div>
                                  <h3 className="mr-3">
                                    {product.offerPrice} Rs
                                  </h3>
                                </div>
                              </div>
                            </CardBody>

                            <Button
                              // value={cardItems.key}
                              color="success"
                              onClick={() => addToCart(product)}
                            >
                              Add Cart
                            </Button>
                          </Card>
                        );
                      }
                    })}
                </div>
              )}
              {view && view === 2 && (
                <ProductDetails
                  product={selectedProduct}
                  backHandle={backHandler}
                />
              )}
            </Container>
          </>
        )}
      </div>
    </>
  );
}

export default Viewproduct;
