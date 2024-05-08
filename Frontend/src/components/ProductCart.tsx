import { FaPlus } from "react-icons/fa";
import { CartItem } from "../types/types";

 type productProps = {
   productId:string,
   photo:string,
   stock:number,
   name: string,
   price: number,
   handler: (cartItem: CartItem)=> string| undefined;
  }

const server = "WIIL_BE_IMORTED"
const ProductCart = ({
  productId,
  photo,
  stock,
  name,
  price,
  handler
}: productProps) => {
  return (
     <div className="productcart">
      <img  src={`${server}/${photo}`} alt={name}/>
      <p>{name}</p>
      <span>{price}</span>
      <div>
        <button onClick={()=> handler({productId, price, name, photo, stock, quantity: 1})}>
          <FaPlus/>
        </button>
      </div>
     </div>
  )
}

export default ProductCart