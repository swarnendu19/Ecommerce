import { FaPlus } from "react-icons/fa";

 type productProps = {
   productId:string,
   photo:string,
   stock:number,
   name: string,
   price: number,
   handler: ()=> void;
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
      <img  src={photo} alt={name}/>
      <p>{name}</p>
      <span>{price}</span>
      <div>
        <button onClick={()=> handler()}>
          <FaPlus/>
        </button>
      </div>
     </div>
  )
}

export default ProductCart