import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { serverUrl } from '../App'
import { setAllReview } from '../redux/reviewSlice'
import axios from 'axios'

const useAllReviews = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/review/allReview`,
          { withCredentials: true }
        )
        console.log("All reviews:", result.data)
        dispatch(setAllReview(result.data.data || result.data))
      } catch (error) {
        console.log("Error:", error.response?.data)
        dispatch(setAllReview([]))
      }
    }
    
    fetchAllReviews()
  }, [dispatch])
}

export default useAllReviews