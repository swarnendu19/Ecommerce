import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";

const cartItems = [
  {
    productId: "assdfff",
    photo: "",
    name: "macbook",
    price: 3000,
    quantity: 4,
    stock: 4,
  }
];
const subtotal = 4000;
const tax = Math.round(subtotal*.18);
const shippingCharges = 200;
const discount = 400;
const total = subtotal +tax + shippingCharges;

function Cart() {

  const [couponCode, setCouponCode] = useState<string>("")
  const [isValidcouponCode, setIsValidCouponCode] = useState<boolean>(false)

  useEffect(()=>{
   const timeOutId = setTimeout(()=>{
    if(Math.random()>0.5) setIsValidCouponCode(true)
    else setIsValidCouponCode(false)
   },1000);
   return ()=>{
    clearTimeout(timeOutId);
    setIsValidCouponCode(false);
   }
  },[couponCode])

  return (
    <div className='cart'>
      <main>
        {
          cartItems.length > 0 ? (cartItems.map((i,index) => (
            <CartItem key = {index} cartItem={i} />
        ))):(<h1>No Items Added</h1>)
        }
      </main>
      <aside>

        <p>Subtotal: ${subtotal}</p>
        <p>Shipping Charges : ${shippingCharges}</p>
        <p>Tax: {tax}</p>
        <p>
          Discount - <em>${discount}</em>
        </p>
        <p>
        <b>Total:${total}</b>
        </p>
        <input type="text"  
        value={couponCode}
        placeholder="Coupon code"
        onChange={
          (e)=> setCouponCode(e.target.value)
        }/>

        {
          couponCode && (
            isValidcouponCode ? (
              <span className="green">
              ${discount} off using the <code>{couponCode}</code>
            </span>
            )
             : 
            (<span className="red">
            Invalid code <VscError/>
          </span>
          )
        )
       }
      {
        cartItems.length > 0 && <Link to={"/shipping"}></Link>
      }
         
      </aside>
    </div>
  )
}

export default Cart
