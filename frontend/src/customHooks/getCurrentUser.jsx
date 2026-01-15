import { useEffect } from "react"
import { serverUrl } from "../App"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setUserData } from "../redux/userSlice"

const getCurrentUser = () => {
    const dispatch = useDispatch() // 'let' ki jagah 'const' use karo
   
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/currentuser`, {
                    withCredentials: true
                })
                console.log("User data received:", result.data)
                dispatch(setUserData(result.data.data)) // Likely result.data.data hoga
            } catch (error) {
                console.log("getCurrentUser error:", error.response?.data || error.message)
                dispatch(setUserData(null))
            }
        }
        fetchUser()
    }, [dispatch]) // dependency array mein dispatch add karo
}

export default getCurrentUser