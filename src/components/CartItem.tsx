 import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom"
 type CartItemProps ={
    cartItem: any ; 

 }


function CartItem({cartItem}: CartItemProps) {

  const {photo , productId, name , price, quantity} = cartItem  
  return (
    <div className="cart-item">
     <img src={photo} alt={name} />
     <article>
        <Link to= {`/product/${productId}`}>{name}</Link>
        <span>${price}</span>
     </article>   
     <div>
        <button>-</button>
        <p>{quantity}</p>
        <button>+</button>
     </div>   
     <button>
        <FaTrash/>
     </button>
  
    </div>
  )
}

export default CartItem