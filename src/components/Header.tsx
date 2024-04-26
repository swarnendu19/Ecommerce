import { Link } from 'react-router-dom'
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { useState } from 'react'

const user = {_id: "ags", role: "admin"}

function Header() {
  const [isOpen, setIsopen] = useState<boolean>(false);
  
  const logouthandler = async ()=>{
    setIsopen(false)
  }

  return (
    <nav className='header'>
     <Link to={"/"} onClick={()=>setIsopen(false)}>
        Home
     </Link>
     <Link to={"/search"} onClick={()=>setIsopen(false)}>
        <FaSearch/>
     </Link>

     <Link to={"/cart"} onClick={()=>setIsopen(false)}>
      <FaShoppingBag/>
     </Link>

{
     user?._id ? (
      <>
       <button onClick={()=> setIsopen((prev)=> !prev)}>
        <FaUser/>
       </button>
       <dialog open={isOpen}>
        <div>
          {
            user.role == "admin" && (
              <Link to={"/admin/dashboard"} onClick={()=>setIsopen(false)}>Admin</Link>
            )
          }

          <Link onClick={()=>setIsopen(false)} to={"/orders"}>
            Orders
          </Link>
          <button onClick={logouthandler}>
            <FaSignOutAlt/>
          </button>
        </div>
       </dialog>
      </>
      ) : (
       <Link to={"/login"} >
        <FaSignInAlt/>
       </Link>
     )

}
    </nav>
  )
}

export default Header
