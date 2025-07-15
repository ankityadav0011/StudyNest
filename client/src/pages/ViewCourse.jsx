import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams } from "react-router-dom"

import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal"
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice"
import Spinner from "../components/Common/Spinner" // Import Spinner

export default function ViewCourse() {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [reviewModal, setReviewModal] = useState(false)
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state


  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const courseData = await getFullDetailsOfCourse(courseId, token)

        // Add console log to inspect fetched data
        console.log("Fetched Course Data: ", courseData);

        if (!courseData || !courseData.courseDetails) {
            console.error("Error fetching course data: Data is null or missing courseDetails");
            setError("Could not load course details."); // Set an error message
            setLoading(false); // Set loading to false
            return; // Stop execution if data is invalid
        }

        dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
        dispatch(setEntireCourseData(courseData.courseDetails))
        dispatch(setCompletedLectures(courseData.completedVideos))

        let lectures = 0
        courseData?.courseDetails?.courseContent?.forEach((sec) => {
          lectures += sec.subSection.length
        })
        dispatch(setTotalNoOfLectures(lectures))

        setLoading(false); // Set loading to false after successful fetch

      } catch (error) {
        console.error("Error fetching full course details:", error);
        setError("Could not load course details due to an error."); // Set an error message
        setLoading(false); // Set loading to false
      }
    })()
    // Add dependencies to useEffect
  }, [courseId, token, dispatch])


  // Render loading or error state
  if (loading) {
      return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
              <Spinner />
          </div>
      );
  }

  if (error) {
       return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center text-red-500">
              <p>{error}</p>
          </div>
      );
  }


  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)]">
        <VideoDetailsSidebar setReviewModal={setReviewModal} />
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <div className="mx-6">
            <Outlet />
          </div>
        </div>
      </div>
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  )
}
