import { useState } from "react"
import { FcGoogle } from "react-icons/fc"

 
function Login() {
    const [gender, setGender] = useState("")
    const [date, setDate] = useState("")
  
  return (
    <div className="login">
        <main>
            <h1 className="heading">Login</h1>
            <div>
                <label htmlFor="">Gender</label>
                <select name="" id=""
                 value={gender} 
                 onChange={e => setGender(e.target.value)}
                >
                <option value=""> Select Gender</option>
                <option value="male">Male</option>

                <option value="female" > Female</option>
                </select>
            </div>

            <div>
                <label htmlFor="">Date</label>
                <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                />
            </div>

            <div>
                <p>Already Signed In Once</p>
                <button>
                    <FcGoogle/> <span>Sign In with Google</span>
                </button>
            </div>
        </main>
    </div>
  )
}

export default Login