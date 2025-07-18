import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Footer from "../components/Common/Footer";
import Course_Card from "../components/core/Catalog/Course_Card";
import Course_Slider from "../components/core/Catalog/Course_Slider";
import { apiConnector } from "../services/apiConnector";
import { categories } from "../services/apis";
import { getCatalogPageData } from "../services/operations/pageAndComponntDatas";
import Error from "./Error";

function Catalog() {
  const { loading } = useSelector((state) => state.profile);
  const { catalogName } = useParams();
  const [active, setActive] = useState(1);
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");

  // 🔹 Fetch All Categories
  useEffect(() => {
    (async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        console.log("Fetched Categories:", res?.data?.data); // ✅ Debug log

        const category = res?.data?.data?.find(
          (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
        );

        if (category) {
          console.log("Selected Category ID:", category._id); // ✅ Debug log
          setCategoryId(category._id);
        } else {
          console.warn("No matching category found for:", catalogName);
        }
      } catch (error) {
        console.error("Could not fetch Categories:", error);
      }
    })();
  }, [catalogName]);

  // 🔹 Fetch Catalog Page Data
  useEffect(() => {
    if (categoryId) {
      (async () => {
        try {
          console.log("Fetching catalog page data for category ID:", categoryId);
          const res = await getCatalogPageData(categoryId);
          console.log("Catalog Page Data Response:", res);
          setCatalogPageData(res);
        } catch (error) {
          console.error("Error fetching catalog page data:", error);
        }
      })();
    }
  }, [categoryId]);

  // 🔹 Show Loading Spinner if Data Not Ready
  if (loading || !catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  // 🔹 Show Error Page if API Failed
  if (!loading && !catalogPageData.success) {
    return <Error />;
  }

  return (
    <>
      {/* Hero Section */}
      <div className="box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
          <p className="text-sm text-richblack-300">
            {`Home / Catalog / `}
            <span className="text-yellow-25">
              {catalogPageData?.data?.selectedCategory?.name || "Category"}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {catalogPageData?.data?.selectedCategory?.name || "Category"}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {catalogPageData?.data?.selectedCategory?.description || ""}
          </p>
        </div>
      </div>

      {/* Section 1: Courses to Get Started */}
      <div className="mx-auto w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Courses to get you started</div>
        <div className="my-4 flex border-b border-b-richblack-600 text-sm">
          <p
            className={`px-4 py-2 cursor-pointer ${
              active === 1 ? "border-b-yellow-25 text-yellow-25" : "text-richblack-50"
            }`}
            onClick={() => setActive(1)}
          >
            Most Popular
          </p>
          <p
            className={`px-4 py-2 cursor-pointer ${
              active === 2 ? "border-b-yellow-25 text-yellow-25" : "text-richblack-50"
            }`}
            onClick={() => setActive(2)}
          >
            New
          </p>
        </div>
        <Course_Slider Courses={catalogPageData?.data?.selectedCategory?.courses || []} />
      </div>

      {/* Section 2: Top Courses */}
      <div className="mx-auto w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">
          Top courses in {catalogPageData?.data?.differentCategory?.name || "Other Category"}
        </div>
        <Course_Slider Courses={catalogPageData?.data?.differentCategory?.courses || []} />
      </div>

      {/* Section 3: Frequently Bought */}
      <div className="mx-auto w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Frequently Bought</div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {(catalogPageData?.data?.mostSellingCourses || []).slice(0, 4).map((course, i) => (
            <Course_Card course={course} key={i} Height="h-[400px]" />
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Catalog;
