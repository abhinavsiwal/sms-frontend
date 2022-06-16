import React, { useState, useEffect } from "react";

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
// import {cartItems} from './productList'
// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { useSelector, useDispatch } from "react-redux";
//import CSS
import "./Ecommerce.css";

//Add to cart
import Addtocart from "./Addtocart";
import {
  addItemsToCart,
  removeFromCart,
  decreaseCart,
  increaseCart,
  getTotal,
} from "../../../store/reducers/cart";

function Ecommerce() {
  const dispatch = useDispatch();

  const [checked, setChecked] = React.useState(false);
  const [qty, setQty] = useState();
  const { cartItems } = useSelector((state) => state.cartReducer);
  useEffect(() => {
    console.log(cartItems);
    dispatch(getTotal());
  }, [dispatch, cartItems]);

  const increaseQty = (product) => {
    console.log("clicked");
    if (product.quantity < product.stock) {
      dispatch(increaseCart(product));
    } else {
      // alert.error("Item out of stock");
      console.log("Item out of stock");
    }
  };
  const decreaseQty = (product) => {
    dispatch(decreaseCart(product));
  };

  const removeItemFromCart = (product) => {
    dispatch(removeFromCart(product));
  };

  const Cart = (e) => {
    setChecked(!checked);
  };

  return (
    <div>
      {checked ? (
        <Addtocart />
      ) : (
        <>
          <SimpleHeader name="Student" parentName="Time Table" />
          <Container className="mt--6" fluid>
            <Row>
              <Col className="mt-4 ">
                <Button className="float-right" color="success" onClick={Cart}>
                  <i className="ni ni-cart">Cart</i>
                </Button>
              </Col>
            </Row>

            <div className="items ">
              {cartItems.map((product, index) => {
                return (
                  <Card className="mt-4" key={index}>
                    <CardBody>
                      <CardImg
                        alt="..."
                        src={product.img}
                        top
                        className="p-4"
                        style={{ width: "100%", height: "100%" }}
                      />
                    </CardBody>
                    <div className="pb-4">
                      <h2 className="ml-3">{product.name}</h2>
                    </div>
                    <div className="mb-3 ml-2 d-flex justify-content-between">
                      <div>
                        <button
                          className="Add_Value_Button"
                          onClick={() => decreaseQty(product)}
                        >
                          -
                        </button>
                        <span className="ml-2 mr-2 Span_Value">
                          {product.quantity}
                        </span>
                        <button
                          className="Add_Value_Button"
                          onClick={() => increaseQty(product)}
                        >
                          +
                        </button>
                      </div>
                      <div>
                        <h3 className="mr-3">{product.price} Rs</h3>
                      </div>
                    </div>

                    <Button
                      color="success"
                      onClick={() => removeItemFromCart(product)}
                    >
                      Add Cart
                    </Button>
                  </Card>
                );
              })}
            </div>
          </Container>
        </>
      )}
    </div>
  );
}

export default Ecommerce;
