import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiRadio, FiBookOpen, FiUser, FiCheckCircle } from 'react-icons/fi'
import useAxiosSecure from '../../../../hooks/useAxiosSecure'
import useUser from '../../../../hooks/useUser'

const EnrolledClasses = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const axiosSecure = useAxiosSecure()
  const { currentUser, isLoading } = useUser()

  useEffect(() => {
    if (currentUser?.email) {
      setLoading(true)
      axiosSecure
        .get(`/enrolled-classes/${currentUser.email}`)
        .then((res) => {
          setData(Array.isArray(res.data) ? res.data : [])
          setLoading(false)
        })
        .catch((err) => {
          console.error('Error fetching enrolled classes:', err)
          setLoading(false)
        })
    } else if (!isLoading) {
      setLoading(false)
    }
  }, [currentUser?.email, isLoading])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy">
          My <span className="text-teal">Training & Enrolled Classes</span>
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Access your courses, study materials, and join live 50-student studio sessions with your instructors.
        </p>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-card border border-border-ui">
          <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-medium text-text-secondary">Loading your enrolled courses...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white rounded-card border border-border-ui p-10 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-teal-100 text-teal flex items-center justify-center mx-auto text-2xl">
            <FiBookOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-navy">No Enrolled Classes Yet</h3>
            <p className="text-sm text-text-secondary max-w-md mx-auto mt-1">
              Explore our wide range of beginner to master yoga classes and join live group workshops today!
            </p>
          </div>
          <Link
            to="/dashboard/explore-classes"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal text-white font-semibold text-sm rounded-btn hover:bg-teal-600 transition-colors shadow-sm"
          >
            Explore Classes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((item, index) => {
            const cls = item.classes
            if (!cls) return null

            const isLive = cls.liveStatus === 'live'

            return (
              <div
                key={index}
                className="bg-white rounded-card border border-border-ui shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail & Badges */}
                  <div className="relative aspect-[16/9] w-full bg-surface-2 overflow-hidden">
                    <img
                      src={cls.image}
                      alt={cls.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />

                    {/* Live Badge if broadcasting */}
                    {isLive && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                        <span>LIVE NOW</span>
                      </div>
                    )}

                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-teal border border-teal/20 shadow-sm flex items-center gap-1">
                      <FiCheckCircle className="w-3.5 h-3.5 text-teal" />
                      <span>Enrolled</span>
                    </div>

                    <div className="absolute bottom-3 left-3 bg-navy/90 text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-sm backdrop-blur-sm">
                      ₹{cls.price}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-3">
                    <h2 className="text-base font-bold text-navy line-clamp-1">{cls.name}</h2>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <FiUser className="w-3.5 h-3.5 text-teal" />
                      <span>Instructor: <strong className="text-text-primary">{cls.instructorName || 'Yoga Master'}</strong></span>
                    </div>
                    {cls.description && (
                      <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                        {cls.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-4 bg-bg-base border-t border-border-ui flex items-center justify-between gap-3">
                  <Link
                    to="/dashboard/course-details"
                    className="px-3.5 py-2 text-xs font-semibold text-text-primary bg-white border border-border-ui rounded-btn hover:bg-surface-2 transition-colors"
                  >
                    Course Materials
                  </Link>

                  {/* Join Live Studio Button */}
                  <Link
                    to={`/dashboard/live-class/${cls._id}`}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-btn shadow-sm transition-all duration-150 ${
                      isLive
                        ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                        : 'bg-teal hover:bg-teal-600'
                    }`}
                  >
                    <FiRadio className="w-3.5 h-3.5" />
                    <span>{isLive ? 'Join Live Studio 🔴' : 'Enter Live Studio'}</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default EnrolledClasses