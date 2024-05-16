import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import{getnewTk} from '../user/tokenSlide'

export const purchaseSlice = createSlice({
  name: 'purchase_info',
  initialState: {
    bookbuy:[],
    totalPrice:0,
    shipprice:0,
  },
  reducers: {
    PrductDetail_setPurchase: (state, action) => { //take object argument
      const { bookid, quantity,pricePerBook, totalprice } = action.payload;

      const book=[{bookid:bookid,quantity:quantity,pricePerBook:pricePerBook,totalprice:totalprice }]
      const price = pricePerBook*quantity
      console.log("day la2: ", price)
      return {...state,bookbuy:book,totalPrice:price }
    }
    ,
    Cart_setPurchase: (state, action)=>{ // take array of obj argument
        let cost =0;
        action.payload.map((item)=>{
            cost+=item.price*item.quantity
        })
        return {...state,bookbuy:action.payload,totalPrice:cost}
    }
    },
})
    
// function to send to backend thanh toans


export const { PrductDetail_setPurchase,Cart_setPurchase } = purchaseSlice.actions;

export default purchaseSlice.reducer;