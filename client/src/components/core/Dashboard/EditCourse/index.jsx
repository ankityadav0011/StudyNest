import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import { getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsAPI"
import { setCourse, setEditCourse } from "../../../../slices/courseSlice"
import RenderSteps from "../AddCourse/RenderSteps"
import Spinner from "../../../Common/Spinner" // ✅ Spinner imported

export default function EditCourse() {
  const dispatch = useDispatch()
  const { courseId } = useParams()
  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true)
      const result = await getFullDetailsOfCourse(courseId, token)
      if (result?.courseDetails) {
        dispatch(setEditCourse(true))
        dispatch(setCourse(result?.courseDetails))
      }
      setLoading(false)
    }

    fetchCourseDetails()
  }, [courseId, token, dispatch])

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <Spinner /> {/* ✅ Spinner shown during loading */}
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">Edit Course</h1>
      <div className="mx-auto max-w-[600px]">
        {course ? (
          <RenderSteps />
        ) : (
          <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
            Course not found
          </p>
        )}
      </div>
    </div>
  )
}
