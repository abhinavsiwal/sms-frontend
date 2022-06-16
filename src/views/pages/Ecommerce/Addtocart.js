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
  CardImg,
  CardFooter,
} from "reactstrap";

// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";
// import Viewcart from "./Viewcart";
import Viewproduct from "./Viewproduct";
import { useSelector, useDispatch } from "react-redux";
import {createOrder} from 'api/order'
import {
  addItemsToCart,
  removeFromCart,
  decreaseCart,
  increaseCart,
  getTotal,
  clearCart
} from "../../../store/reducers/cart";
import { toast } from "react-toastify";
import {useHistory} from 'react-router-dom'
function Addtocart({ handleCartBack }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { user } = isAuthenticated();
  const [checked, setChecked] = React.useState(false);
  const { cartItems, cartTotalAmount } = useSelector(
    (state) => state.cartReducer
  );

  const Cart_Back = () => {
    setChecked(true);
  };
  useEffect(() => {
    // console.log(cartItems);
    dispatch(getTotal());
  }, [dispatch, cartItems]);

  const increaseQty = (product) => {
    // console.log("clicked");
    if (product.quantity < product.stock) {
      dispatch(increaseCart(product));
    } else {
      // alert.error("Item out of stock");
      toast.error(`${product.name} out of stock`);
    }
  };
  const decreaseQty = (product) => {
    dispatch(decreaseCart(product));
  };

  const removeItemFromCart = (product) => {
    dispatch(removeFromCart(product));
  };

  const checkoutHandler = async() => {
    console.log(user);
    let formData;
    if (user.user === "staff") {
      formData = {
        orderItems: cartItems,
        totalAmount: cartTotalAmount,
        school: user.school,
        staff: user._id,
        
      };
    } else if(user.user==="student"){
      formData = {
        orderItems: cartItems,
        totalAmount: cartTotalAmount,
        school: user.school,
        student: user._id,
      };
    }
    console.log(formData);
    try {
      const data = await createOrder(user._id, formData);
      console.log(data);
      if(data.err){
        toast.error(data.err);
        return;
      }
      toast.success(`Order placed successfully`);
      dispatch(clearCart());
      history.push('/admin/view-products');
    } catch (err) {
      console.log(err);
      toast.error("Order failed");
    }


  };

  return (
    <Container className="mt--6" fluid>
      <Row>
        <Col className="mt--3 ">
          <Button
            className="float-left mb-2"
            color="dark"
            onClick={handleCartBack}
          >
            <i className="ni ni-bold-left"></i>
          </Button>
        </Col>
      </Row>

      <div className="cart_items">
        {cartItems.map((product, index) => {
          return (
            <Card>
            
              <CardBody>
                <div className="d-flex">
                  <div className="p-2">
                    <img className="Shopping_Cart_Img" src={product.image} />
                  </div>
                  <div className="p-2">
                    <h4>{product.name}</h4>
                  </div>
                  <div className="ml-auto p-2">
                    {" "}
                    <h3>{product.price} Rs</h3>
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <div className="ml-2">
                    <button
                      className="Add_Value_Button"
                      onClick={() => decreaseQty(product)}
                    >
                      -
                    </button>
                    <span className="ml-2 mr-2 Span_Value">
                      {" "}
                      {product.quantity}
                    </span>
                    <button
                      className="Add_Value_Button"
                      onClick={() => increaseQty(product)}
                    >
                      +
                    </button>
                  </div>
                  <Button
                    color="danger"
                    className="float-right"
                    onClick={() => removeItemFromCart(product)}
                  >
                    Remove
                  </Button>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardBody>
          <div className="d-flex justify-content-between">
            <Button color="warning" onClick={checkoutHandler}>
              Checkout&Proceed
            </Button>
            <div className="d-flex justify-content-between">
              <h2 className="mr-2">Sub Total:</h2>
              <h3 className="mt-1">{cartTotalAmount}Rs</h3>
            </div>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
}

export default Addtocart;
