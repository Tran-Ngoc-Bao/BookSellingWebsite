import React, { useEffect, useState } from "react";
import axios from "axios";
import UserContext from "../../UserContext";
import { useContext } from "react";
import  { useReducer } from 'react';


const initialState = {
  name: null,
  id: null,
  price: null,
  quantity: 0,
  totalprice: 0,
};

let count =0;

const reducer = (state, action) => {
  switch (action.type) {
    case 'update':
      return {
        name: action.payload.name,
        id: action.payload.id,
        price: action.payload.price,
        quantity: action.payload.quantity,
        totalprice: action.payload.totalprice,
      };
    case 'increment':
      return { ...state, quantity: state.quantity + 1 };
    case 'decrement':
      return { ...state, quantity: state.quantity - 1 };
    case 'updateTotalPrice':
      return { ...state, totalprice: state.price * state.quantity };
    default:
      return state;
  }
};


function CartItem(props) {
  // const [bookC,setBookC]=useState(0)
  const { user } = useContext(UserContext);
  // const [quantity, setQuantity] = useState(1);
  const [book, setBook] = useState(null);
  const {  bookid, addToCost,addToPurchase } = props;
  const [isChecked, setIsChecked] = useState(false);
  // const [item, setItem] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);


  useEffect(() => {
    async function booka() {
      const fetchedBook = await axios.get(`/api/books/${bookid}`);
      setBook(fetchedBook.data);
      addToCost(fetchedBook.data.price);
    }
    booka();
  }, [user,bookid]);

  useEffect(() => {
    if (book) {
      const totalprice = book.price ;
        const payload = {
          name: book.title,
          id: bookid,
          price: book.price,
          quantity: 1,
          totalprice: totalprice,
        };
      dispatch({ type: 'update', payload: payload });

      console.log("initialize state: ",state)
    }
  }, [book, user]);

  useEffect(()=>{
    if (isChecked) {
      addToPurchase(state);
      console.log("add this to purchase: ",state)
    }else{
      if(count>0)
      console.log("remove this from purchase: ",state)
    }
  },[isChecked,state])

  // price = props.cost+book.price
  // props.setCost(price)

  function increase() {
    // setQuantity(prevQuantity => prevQuantity + 1);
    dispatch({ type: 'increment'});
   props.addToCost(book.price)
    dispatch({type:"updateTotalPrice"})
  }
  
  function decrease() {
    if (state.quantity > 1) {
      dispatch({ type: 'decrement'});
      props.removeFromCost(book.price)
      dispatch({type:"updateTotalPrice"})
    }
  }

  function remove() {
    // Calculate the price of the removed book
    const removedBookPrice = state.totalprice;
    // Update the cart and cost states
    props.removeFromCost(removedBookPrice)
    // Remove the book from the parent component's cart state using its id
    props.remove(bookid);
    props.removeFromPurchase(state);
    
  }

  function clickHandler() {
    if (state) {
      setIsChecked((prevChecked) => {
        const newState = !prevChecked; // Toggle the isChecked state

        // Depending on the new state, call the appropriate function to add or remove the item from purchase
        if (newState) {
          props.addToPurchase(state);
        } else {
          props.removeFromPurchase(state);
          count ++
        }
        return newState; // Return the new state value
      });
    }
  }

  return (
    <div>
      {book && <p>{book.title}</p>}
      {book && (
        <img
          src={`../images/${book._id}.jpeg`}
          width={70}
          height={70}
          alt={"small book"}
        />
      )}
      {book && <button onClick={increase}>+</button>}
      <span>{state.quantity}</span>
      {book && <button onClick={decrease}>-</button>}
      <button onClick={remove}>Remove</button>
      {book && <p>Đơn giá: {book.price}USD </p>}
      
      <p>Tổng giá: {state.totalprice}</p>
      <input type="checkBox" id="chosen" onChange={clickHandler} />
    </div>
  );
}

export default CartItem;