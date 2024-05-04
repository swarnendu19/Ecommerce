import { Link } from "react-router-dom";
import ProductCart from "../components/ProductCart";
 

function Home() {
  const addToCartHandler = () => {};

  return (
    <div className="home">
      <section>

      </section>
      <h1>
        Latest Product
        <Link to={"/search"} className="findmore">
          More
        </Link>
      </h1>

      <main>
        <ProductCart
          key={45}
          productId="ffrrgts"
          price={22443}
          stock={23}
          name="Macbook"
          handler={addToCartHandler}
          photo= "../assets/macbook.jpg"
        />
      </main>
    </div>
  );
}

export default Home;
