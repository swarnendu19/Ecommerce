import { Link } from 'react-router-dom'
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { useState } from 'react'
import {User} from "../types/types" 
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import toast from 'react-hot-toast'

interface PropType{
  user: User | null
}
function Header({user}: PropType) {
  const [isOpen, setIsopen] = useState<boolean>(false);
  
  const logouthandler = async ()=>{
     try {
      await signOut(auth);
      toast.success("Sign Out Successfully");
      setIsopen(false)
     } catch (error) {
      toast.error("Sign Out Fail");
     }
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
