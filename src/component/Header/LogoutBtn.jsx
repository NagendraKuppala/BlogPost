import { useDispatch } from "react-redux"
import authSlice, { logout } from "../../store/authSlice"


function LogoutBtn() {

    const dispatch = useDispatch()
    const logoutHandler = () => {
        authSlice.logout().then(()=>{
            dispatch(logout())
        })
        }

  return (
    <button onClick={logoutHandler}>Logout</button>
  )
}

export default LogoutBtn