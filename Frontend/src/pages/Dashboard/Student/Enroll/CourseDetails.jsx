import React from 'react';
import { BiTime } from "react-icons/bi";
import { FaLanguage, FaLevelUpAlt, FaUsers } from "react-icons/fa";
import ReactPlayer from 'react-player/youtube';
import bannerImg1 from "../../../../assets/home/banner-1.jpg";

const CourseDetails = () => {
  return (
    <>
      <div className="font-gilroy font-medium text-gray-700 dark:text-white text-lg leading-[27px] w-[90%] mx-auto">
        {/* Header */}
        <div className="py-20 mt-20 bg-blue-300 bg-center bg-no-repeat bg-cover breadcrumbs section-padding">
          <div className="container text-center">
            <h2>Class Video</h2>
          </div>
        </div>

        <div className="mt-8 nav-tab-wrapper tabs section-padding">
          <div className="container">
            <div className="grid grid-cols-12 md:gap-[30px]">
              {/* Left Side - YouTube Video */}
              <div className="col-span-12 lg:col-span-8">
                <div className="single-course-details">
                  <div className="xl:h-[470px] h-[350px] mb-10 course-main-thumb">
                    <ReactPlayer 
                      url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      controls
                      width="100%"
                      height="100%"
                    />
                  </div>

                  <h2 className="mb-2 text-2xl">Class Name: Learn Web Development</h2>

                  <div className="flex items-center mt-6 space-x-5 space-y-5 author-meta sm:lg:space-x-16 sm:space-y-0">
                    <div className="flex items-center space-x-4 group">
                      <div className="flex-none">
                        <div className="w-12 h-12 rounded">
                          <img
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3FDB8MHxwaG90by1wYWd1fHx8fGVufDB8fHx8fAx3D%3D"
                            alt="Instructor"
                            className="object-cover w-full h-full rounded"
                          />
                        </div>
                      </div>

                      <div className="flex-1">
                        <p className="text-secondary">
                          Trainer:{" "}
                          <a href="#" className="text-black">
                            John Doe
                          </a>
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className="text-secondary">
                        Last Update:
                        <a href="#" className="ml-1 text-black">
                          09/15/2023
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Video Selection */}
              <div className="col-span-12 mt-8 lg:col-span-4 md:mt-0">
                <div className="sidebarWrapper space-y-[30px]">
                  <div className="space-y-5 widget custom-text">
                    <h3>Choose Your Class Video</h3>
                    <ul className="list">
                      <li className="flex space-x-4 border-[#ECECEC] pb-6 mb-6 last:pb-0 last:mb-0 last:border-0 border-b">
                        <div className="flex-none">
                          <div className="w-20 h-20 rounded">
                            <img
                              src={bannerImg1}
                              alt=""
                              className="object-cover w-full h-full rounded"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 font-semibold text-black">Web Development Basics</div>
                          <span className="font-semibold text-secondary">Duration: 1 Hr 20 Mins</span>
                        </div>
                      </li>

                      <li className="flex space-x-4 border-[#ECECEC] pb-6 mb-6 last:pb-0 last:mb-0 last:border-0 border-b">
                        <div className="flex-none">
                          <div className="w-20 h-20 rounded">
                            <img
                              src={bannerImg1}
                              alt=""
                              className="object-cover w-full h-full rounded"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 font-semibold text-black">Advanced CSS Techniques</div>
                          <span className="font-semibold text-secondary">Duration: 2 Hr 15 Mins</span>
                        </div>
                      </li>

                      <li className="flex space-x-4 border-[#ECECEC] pb-6 mb-6 last:pb-0 last:mb-0 last:border-0 border-b">
                        <div className="flex-none">
                          <div className="w-20 h-20 rounded">
                            <img
                              src={bannerImg1}
                              alt=""
                              className="object-cover w-full h-full rounded"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 font-semibold text-black">JavaScript Essentials</div>
                          <span className="font-semibold text-secondary">Duration: 3 Hr 30 Mins</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetails;
