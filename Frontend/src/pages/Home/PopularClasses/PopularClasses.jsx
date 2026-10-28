import React, { useEffect, useState } from 'react'
import useAxiosFetch from '../../../hooks/useAxiosFetch'
import Card from './Card'
import { useNavigate } from 'react-router-dom'

const categoryChips = ['All', 'Strength', 'Mobility', 'Flexibility', 'Recovery', 'Posture', 'Core', 'Balance']

const PopularClasses = () => {
  const axiosFetch = useAxiosFetch()
  const [classes, setClasses] = useState([])
  const [active, setActive] = useState('All')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchClasses = async () => {
      const response = await axiosFetch.get('/classes')
      setClasses(response.data)
    }
    fetchClasses()
  }, [])

  const filteredClasses = classes.filter(cls => {
    // Only show approved classes to public
    if (cls.status !== 'approved') return false
    if (active === 'All') return true
    return Array.isArray(cls.categories) ? cls.categories.includes(active) : cls.category === active
  })

  return (
    <section className="py-20 bg-bg-base">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-teal mb-2">Popular Now</p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy leading-tight">Top-rated classes</h2>
          </div>
          <button
            onClick={() => navigate('/classes')}
            className="text-sm font-bold text-teal hover:text-teal-600 flex-shrink-0 flex items-center gap-1 transition-colors"
          >
            See all classes →
          </button>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categoryChips.map((chip) => (
            <button
              key={chip}
              onClick={() => setActive(chip)}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all duration-150 ${
                active === chip
                  ? 'bg-teal text-white border-teal'
                  : 'bg-white text-text-secondary border-border-ui hover:border-teal/50 hover:text-teal'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        {filteredClasses.length === 0 ? (
          <div className="text-center py-16 text-text-secondary">
            <p className="text-4xl mb-3">🧘</p>
            <p className="font-semibold text-text-primary mb-1">No classes found</p>
            <p className="text-sm">Try selecting another category or explore all classes.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredClasses.slice(0, 6).map((item, index) => (
              <Card key={index} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default PopularClasses
