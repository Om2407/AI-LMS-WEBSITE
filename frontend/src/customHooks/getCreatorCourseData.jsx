import { useEffect } from 'react'
import { serverUrl } from '../App'
import axios from 'axios'
import { setCreatorCourseData } from '../redux/courseSlice'
import { useDispatch, useSelector } from 'react-redux'

const useCreatorCourses = () => {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)

    useEffect(() => {
        const fetchCreatorCourses = async () => {
            if (!userData?._id) return

            try {
                const result = await axios.get(
                    `${serverUrl}/api/course/getcreatorcourses`,
                    { withCredentials: true }
                )
                console.log("Creator courses:", result.data)
                dispatch(setCreatorCourseData(result.data.data || result.data))
            } catch (error) {
                console.log("Error:", error.response?.data)
            }
        }
        
        fetchCreatorCourses()
    }, [userData?._id, dispatch])
}

export default useCreatorCourses