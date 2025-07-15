import { useEffect, useState, useRef } from "react";
import { BsChevronDown } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import IconBtn from "../../Common/IconBtn";

export default function VideoDetailsSidebar({ setReviewModal }) {
  const [activeStatus, setActiveStatus] = useState("");
  const [videoBarActive, setVideoBarActive] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionId, subSectionId } = useParams();
  const fileInputRef = useRef(null);

  const {
    courseSectionData = [],
    courseEntireData,
    totalNoOfLectures = 0,
    completedLectures = [],
  } = useSelector((state) => state.viewCourse);

  useEffect(() => {
    if (!courseSectionData.length) return;

    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );

    const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.findIndex(
      (data) => data._id === subSectionId
    );

    const activeSubSectionId =
      courseSectionData?.[currentSectionIndex]?.subSection?.[currentSubSectionIndex]?._id;

    setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
    setVideoBarActive(activeSubSectionId);
  }, [courseSectionData, courseEntireData, location.pathname, sectionId, subSectionId]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r border-richblack-700 bg-richblack-800">
      {/* Header Section */}
      <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
        <div className="flex w-full items-center justify-between">
          <div
            onClick={() => navigate(`/dashboard/enrolled-courses`)}
            className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90 cursor-pointer"
            title="Back"
          >
            <IoIosArrowBack size={30} />
          </div>
          <IconBtn
            text="Add Review"
            customClasses="ml-auto"
            onclick={() => setReviewModal(true)}
          />
        </div>

        {/* Course Name & Progress */}
        <div className="flex flex-col">
          <p>{courseEntireData?.courseName || "Course Title"}</p>
          <p className="text-sm font-semibold text-richblack-500">
            {completedLectures.length} / {totalNoOfLectures} Lectures Completed
          </p>
        </div>
      </div>

      {/* Course Sections */}
      <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
        {courseSectionData.map((course, index) => (
          <div key={course._id || index} className="mt-2 cursor-pointer text-sm text-richblack-5">
            {/* Section Header */}
            <div
              className="flex flex-row justify-between bg-richblack-600 px-5 py-4"
              onClick={() => setActiveStatus((prev) => (prev === course._id ? "" : course._id))}
            >
              <div className="w-[70%] font-semibold">{course.sectionName}</div>
              <span
                className={`transform transition-transform duration-500 ${
                  activeStatus === course._id ? "rotate-180" : "rotate-0"
                }`}
              >
                <BsChevronDown />
              </span>
            </div>

            {/* Sub-Sections (Videos) */}
            {activeStatus === course._id && (
              <div className="transition-[height] duration-500 ease-in-out">
                {course.subSection.map((topic, i) => (
                  <div
                    key={topic._id || i}
                    className={`flex gap-3 px-5 py-2 ${
                      videoBarActive === topic._id
                        ? "bg-yellow-200 font-semibold text-richblack-800"
                        : "hover:bg-richblack-900"
                    }`}
                    onClick={() => {
                      navigate(
                        `/view-course/${courseEntireData?._id}/section/${course._id}/sub-section/${topic._id}`
                      );
                      setVideoBarActive(topic._id);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={completedLectures.includes(topic._id)}
                      onChange={() => {}}
                    />
                    {topic.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Video Upload (if needed) */}
      <div className="p-5 border-t border-richblack-600">
        <button
          className="w-full py-2 px-4 bg-yellow-400 text-richblack-900 rounded-lg hover:bg-yellow-300"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Video
        </button>
        <input
          type="file"
          accept="video/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              console.log("Selected video file:", file);
            }
          }}
        />
      </div>
    </div>
  );
}
