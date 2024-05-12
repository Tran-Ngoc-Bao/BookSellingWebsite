import React, { useEffect, useState } from "react";
import CartItem from "../components/products/CartItem";
import Popup from "../components/products/PopUp";
import { useDispatch, useSelector, shallowEqual,useStore } from 'react-redux';
import {addCartAsync,removeCartAsync} from'../redux/features/cart/cartSlice';



function Cart(props) {
  const dispatch = useDispatch();
  const user =useSelector( state => state.user)
  const {_id}=user
  const cart_info = useSelector( state => state.cart)
  const {book,price}=cart_info // chua id sach, ten sach, gia sach
  
  const [buy, setBuy] = useState(false);
  function doBuy() {
    setBuy(true);
  }
  function closeBuy() {
    setBuy(false);
  }
  const [cost, setCost] = useState(0);
  function addToCost(price) {
    setCost((prevCost) => prevCost + price);
  }
  function removeFromCost(price) {
    setCost((prevCost) => prevCost - price);
  }
  const [purchase, setPurchase] = useState([]);

  function addToPurchase(item) {
    if (purchase.length !== 0) {
      let newpurchase = purchase.filter((curitem) => {
        return curitem.id !== item.id;
      });
      newpurchase = [...newpurchase, item];
      setPurchase(newpurchase);
      console.log("thanh toan: ", newpurchase);
    } else {
      setPurchase([...purchase, item]);
      console.log("thanh toan: ", [...purchase, item]);
    }
  }

  function removeFromPurchase(item) {
    if (purchase.length !== 0) {
      let newpurchase = purchase.filter((curitem) => {
        return curitem.id !== item.id;
      });
      setPurchase(newpurchase);
      console.log("thanh toan: ", newpurchase);
    }
  }


  const [purchasecost, setPurchasecost] = useState(0);
  function getPurchaseCost() {
    let temp = 0;
    for (let i = 0; i < purchase.length; i++) {
      temp += purchase[i].totalprice;
    }
    setPurchasecost(temp);
  }

  function rmCart(id){
    dispatch(removeCartAsync(id))
  }
  

  return (
    <>
    {console.log("no")}
      {_id ? (
        <div>
          <div>Giỏ hàng</div>
          {book.map((book) => (
            <CartItem
              key={book._id}
              cost={cost}
              bookid={book._id}
              remove={rmCart}
              addToCost={addToCost}
              removeFromCost={removeFromCost}
              addToPurchase={addToPurchase}
              removeFromPurchase={removeFromPurchase}
            />
          ))}
          <p>Tổng giá trị giỏ hàng: {cost}$</p>
          <button
            className="Buy"
            onClick={() => {
              doBuy();
              getPurchaseCost();
            }}
          >
            Thanh toán
          </button>
          <Popup isOpen={buy} onClose={closeBuy}>
            <div className="Buycontainer">
              <h2>Kiem tra don hang</h2>
              {console.log(purchase)}
              {purchase &&
                purchase.map((item) => (
                  <div className="row" key={item.name}>
                    <br/>
                    <img
                      src={`../images/${item.id}.jpeg`}
                      width={50}
                      height={50}
                      alt={"buy book"}
                    />
                    <p>ten san pham: {item.name}</p>
                    <p>So luong: {item.quantity}</p>
                    <p>tam tinh: {item.totalprice}</p>
                    <br/>
                    <hr
                      style={{
                        color: "red",
                        backgroundColor: "red",
                        height: 3,
                        border: "none",
                      }}
                    />
                  </div>
                ))}
              <p>tk ngan hang {user.bank.name}</p>
              <p>so tk {user.bank.seri}</p>
              <p>Ship toi {user.address}</p>
              <p>tien don hang {purchasecost}</p>
              <p>tien ship</p>
              <hr
                style={{
                  color: "black",
                  backgroundColor: "black",
                  height: 5,
                }}
              />
              <p>Tong cong</p>
              <button className="order">Dat hang</button>
            </div>
          </Popup>
        </div>
      ) : (
        <p>Đăng nhập để xem giỏ hàng</p>
      )}
    </>
  );
}

export default Cart;
