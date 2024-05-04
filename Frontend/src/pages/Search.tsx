import { useState } from "react"
import ProductCart from "../components/ProductCart";

 
function Search() {

  const addToCartHandler=()=>{}
  
  const [search , setSearch] = useState("");
  const [sort , setSort] = useState("")
  const [maxPrice, setMaxPrice] = useState(10000)
  const [category , setCategory] = useState("")
  const [page, setPage] = useState(1)
  const isNextPage = page < 4;
  const isPreviousPage = page>1

  return (
    <div className="product-search-page">
      <aside>
        <h2>FIlter</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort } 
          onChange={e => setSort(e.target.value)} >
           <option value = "">None</option>
           <option value = "asc">Price (Low to High)</option>
           <option value = "dsc">Price (High to Low)</option>
          </select>
        </div>

        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input 
          type="range"
          min={100}
          max={100000}
          value={maxPrice } 
          onChange={e => setMaxPrice(Number(e.target.value))} >
          </input>
        </div>

        <div>
          <h4>Category</h4>
          <select value={category} 
          onChange={e => setCategory(e.target.value)} >
           <option value = "">All</option>
           <option value = "">Sample1</option>
           <option value = "">Sample2</option>
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input type="text"
        placeholder="Search by Name"
        value={search}
        onChange={e => setSearch(e.target.value)}
        />

        <div className="search-product-list">
          <ProductCart 
          key={45}
          productId="ffrrgts"
          price={22443}
          stock={23}
          name="Macbook"
          handler={addToCartHandler}
          photo= "../assets/macbook.jpg"/>
        </div> 
        <article>
        <button disabled= {!isPreviousPage} 
        onClick={()=> setPage(prev => prev-1)}>prev</button>
          <span>{page} of {4}</span>
          <button 
          disabled = {!isNextPage}
          onClick={()=> setPage(prev => prev+1)}>Next</button>
        </article>
      </main>
    </div>
  )
}

export default Search
