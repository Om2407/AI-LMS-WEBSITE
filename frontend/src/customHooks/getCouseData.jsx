import axios from 'axios'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setCourseData } from '../redux/courseSlice'
import { useEffect } from 'react'

const usePublishedCourses = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchPublishedCourses = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/course/getpublishedcoures`,
          { withCredentials: true }
        )
        console.log("Published courses:", result.data)
        dispatch(setCourseData(result.data.data || result.data))
      } catch (error) {
        console.log("Error:", error.response?.data)
        dispatch(setCourseData([]))
      }
    }
    
    fetchPublishedCourses()
  }, [dispatch])
}

export default usePublishedCourses