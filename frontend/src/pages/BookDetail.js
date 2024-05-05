import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./BookDetail.css";
import BookList from "../components/products/BookList";
import UserContext from "../UserContext";
import { useContext } from "react";
import axios from "axios";

function BookDetail(props) {
  // Access the URL parameters using useParams
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [err, setErr] = useState(null);
  const { user, logout, accesstk } = useContext(UserContext);

  useEffect(() => {
    async function fetchBook() {
      const response = await fetch(`/api/books/${id}`);
      if (response.ok) {
        const json = await response.json();
        setBook(json);
      }
    }

    fetchBook();
  }, []);

  async function AddToCart() {
    console.log(user);
    const userid = user._id;
  
    try {
      // Retrieve the user's cart from the backend
      const cartcontainer = await axios.get(`/api/customers/getdetails/${userid}`, {
        headers: {
          token: accesstk,
        },
      });
      let getcart = cartcontainer.data.cart || [];
      console.log("cart from backend:", getcart);


      // Map existing items in the user's cart to a new array
      let cart=[]
      getcart.map((book) => {
        let bookrep = {};
        bookrep.bookid = book.bookid;
        bookrep.quantity = book.quantity;
        cart.push(bookrep);
      });
  
      // Check if the book is already in the cart
      const isBookInCart = (getcart.some((item) => item.bookid === id)||cart.some((item) => item.bookid === id));
      if (!isBookInCart) {
        // If the book is not in the cart, add it
        const newbook = {
          bookid: id,
          quantity: 1,
        };
        cart.push(newbook);
  
        // Prepare the data to be sent to the backend
        const sentCart = { cart };
  
        console.log("cart send to backend:",sentCart);
        // console.log(userid);
        // console.log(accesstk);
  
        // Send the updated cart to the backend
        const response = await axios.put(`/api/customers/update/${userid}`, sentCart, {
          headers: {
            token: accesstk,
          },
        });
        console.log("updated cart from backend:",response.data.updatedCustomer.cart);
  
        // Reset the cart and set success message
        cart = [];

        setErr("Đã thêm vào giỏ hàng");
      } else {
        // If the book is already in the cart, set error message
        setErr("Sách đã tồn tại trong giỏ hàng");
      }
    } catch (error) {
      // Handle errors
      console.log(error);
      setErr("Error updating the cart");
    }
  }
  
  // Destructure properties from the book object outside the return statement
  // Now you can use the book ID (id) to fetch book details or perform other actions
  // For demonstration, let's just display the book ID

  return (
    <div>
      {book && (
        <div>
          <div className="book">
            <img className="main-img" src={`../images/${id}.jpeg`} alt="anh" />

            <div className="bookdetail">
              <p className="title">{book.title}</p>

              <div className="author">
                <p>Tác giả: </p>
                <div className="author-name">
                  {book.authors.map((author) => (
                    <p key={author}>{author}</p>
                  ))}
                </div>

                <div className="genres">
                  <p>Thể loại: </p>
                  <div className="genre-name">
                    {book.genres.map((genre) => (
                      <p key={genre}>{genre}</p>
                    ))}
                  </div>
                </div>

                <p className="price">${book.price}</p>

                <div className="rate&price">
                  <p className="rating">{book.rate}/5</p>
                  <p className="sold">sold: {book.sold}</p>
                </div>
              </div>
              <div className="detail"></div>
              <button onClick={AddToCart} className="cart">
                Add to cart
              </button>
              <p>{err}</p>

              <button className="Buy"> Buy now</button>
            </div>
          </div>
          <BookList name="Sách được gợi ý" />

          <div className="Comment-section">
            <p>Feedbacks</p>
            {book.feedbacks == null && <p>Chưa có đánh giá</p>}
            {book.feedbacks != null && (
              <div className="comments">
                {book.feedbacks != null && (
                  <div className="comments">
                    {book.feedbacks.map((feedback) => (
                      <div key={feedback.customerid}>
                        <p>User: {feedback.customerid}</p>
                        <p>Đánh giá {feedback.rate}/5</p>
                        <p>Nhận xét: {feedback.text} </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BookDetail;
