import React, { useEffect, useState } from 'react'
import useAxiosFetch from '../../../hooks/useAxiosFetch'
import { useNavigate } from 'react-router-dom'

const specialties = ['Mobility', 'Strength', 'Flexibility', 'Posture', 'Recovery']

const PopularTeacher = () => {
  const [instructors, setInstructors] = useState([])
  const axiosFetch = useAxiosFetch()
  const navigate = useNavigate()

  useEffect(() => {
    axiosFetch.get('/popular-instructors')
      .then((data) => setInstructors(data.data))
      .catch(() => {})
  }, [])

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-teal mb-2">Personal Coaching</p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy leading-tight">
              Book a session with a verified instructor
            </h2>
          </div>
          <button
            onClick={() => navigate('/instructors')}
            className="text-sm font-bold text-teal hover:text-teal-600 flex-shrink-0 flex items-center gap-1 transition-colors"
          >
            See all instructors →
          </button>
        </div>

        {instructors.length === 0 ? (
          <div className="text-center py-16 text-text-secondary">
            <p className="text-4xl mb-3">👤</p>
            <p className="font-semibold text-text-primary mb-1">No instructors to display yet</p>
            <p className="text-sm">Our coaching team is growing — check back soon.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {instructors.map((instructor, i) => {
              const name = instructor?.instructor?.name || 'Instructor'
              const photo = instructor?.instructors?.photoUrl
              const enrolled = instructor?.totalEnrolled || 0
              const specialty = specialties[i % specialties.length]

              return (
                <div
                  key={i}
                  className="bg-white border border-border-ui rounded-card p-5 transition-card hover-lift flex flex-col"
                >
                  {/* Avatar */}
                  <div className="flex items-center gap-3 mb-4">
                    {photo ? (
                      <img src={photo} alt={name} className="w-12 h-12 rounded-full object-cover border-2 border-border-ui" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal font-bold text-lg flex-shrink-0">
                        {name[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-text-primary">{name}</p>
                      <p className="text-xs text-teal font-semibold">{specialty}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs text-text-secondary mb-4">
                    <span className="flex items-center gap-1">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      {enrolled} students
                    </span>
                    <span className="flex items-center gap-1 ml-auto text-warning">
                      ★ 4.8
                    </span>
                  </div>

                  <button
                    onClick={() => navigate('/instructors')}
                    className="w-full py-2 border border-teal text-teal text-xs font-bold rounded-btn hover:bg-teal hover:text-white transition-all duration-200 mt-auto"
                  >
                    Book a session
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default PopularTeacher
