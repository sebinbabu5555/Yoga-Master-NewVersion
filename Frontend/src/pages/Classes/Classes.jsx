import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useUser from '../../hooks/useUser'
import useAxiosFetch from '../../hooks/useAxiosFetch'
import useAxiosSecure from '../../hooks/useAxiosSecure'

const categoryChips = ['All', 'Strength', 'Mobility', 'Flexibility', 'Recovery', 'Posture', 'Core', 'Balance']
const difficultyOptions = ['All levels', 'Beginner', 'Intermediate', 'Advanced']

const difficultyBadge = {
  Beginner:     'bg-teal-100 text-teal',
  Intermediate: 'bg-coral-100 text-coral',
  Advanced:     'bg-blue-ai-100 text-blue-ai',
}

const Classes = () => {
  const { currentUser } = useUser()
  const [classes, setClasses] = useState([])
  const [enrolledClasses, setEnrolledClasses] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [activeDiff, setActiveDiff] = useState('All levels')
  const axiosFetch = useAxiosFetch()
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate()
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')
  const role = currentUser?.role

  useEffect(() => {
    axiosFetch.get('/classes')
      .then(res => setClasses(res.data))
      .catch(() => {})
  }, [])

  const handleCategoryClick = (chip) => {
    if (chip === 'All') {
      setSelectedCategories([])
      return
    }
    setSelectedCategories(prev =>
      prev.includes(chip)
        ? prev.filter(c => c !== chip)
        : [...prev, chip]
    )
  }

  const handleResetFilters = () => {
    setSelectedCategories([])
    setActiveDiff('All levels')
    setSearch('')
  }

  const filtered = classes.filter(cls => {
    // Only display approved classes to public
    if (cls.status !== 'approved') return false

    const matchSearch = cls.name?.toLowerCase().includes(search.toLowerCase()) ||
                        cls.instructorName?.toLowerCase().includes(search.toLowerCase())
    const matchDiff = activeDiff === 'All levels' || cls.level === activeDiff
    
    // Multi-category OR filtering: match if class belongs to any selected category
    let matchCat = true
    if (selectedCategories.length > 0) {
      const classCats = Array.isArray(cls.categories)
        ? cls.categories
        : (cls.category ? [cls.category] : [])
      matchCat = selectedCategories.some(cat => classCats.includes(cat))
    }

    return matchSearch && matchDiff && matchCat
  })

  const handleSelect = (id) => {
    if (!currentUser) {
      toast.error('Sign in to save a class')
      return
    }
    axiosSecure.get(`/enrolled-classes/${currentUser.email}`)
      .then(res => setEnrolledClasses(res.data))
      .catch(() => {})

    axiosSecure.get(`/cart-item/${id}?email=${currentUser.email}`)
      .then(res => {
        if (res.data.classId === id) {
          toast.warn('Already in your saved list')
        } else if (enrolledClasses.find(item => item.classes._id === id)) {
          toast.warn("You're already enrolled in this class")
        } else {
          axiosSecure.post('/add-to-cart', { classId: id, userMail: currentUser.email, date: new Date() })
            .then(() => toast.success('Saved to your list'))
            .catch(() => toast.error('Could not save — please try again'))
        }
      })
      .catch(() => toast.error('Something went wrong'))
  }

  return (
    <div className={isDashboard ? "w-full" : "min-h-screen bg-bg-base"}>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Page header */}
      {isDashboard ? (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy">Explore Classes</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Browse {classes.length} approved classes across skill levels and categories.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search classes or instructors..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-border-ui rounded-btn text-xs text-text-primary placeholder-text-secondary focus:outline-none focus:border-teal transition-all"
            />
          </div>
        </div>
      ) : (
        <div className="pt-24 pb-8 bg-navy">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
            <h1 className="text-3xl font-bold text-white mb-1">Find your next class</h1>
            <p className="text-sm text-white/60">Browse {classes.length} classes across all skill levels and goals.</p>

            {/* Search */}
            <div className="relative mt-5 max-w-lg">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search classes, instructors, or goals"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-btn text-white placeholder-white/40 text-sm focus:outline-none focus:border-teal focus:bg-white/15 transition-all"
              />
            </div>
          </div>
        </div>
      )}

      <div className={isDashboard ? "w-full pb-8" : "max-w-[1360px] mx-auto px-4 sm:px-6 py-8"}>
        {/* Filter row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Category chips */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {categoryChips.map(chip => {
              const isAll = chip === 'All'
              const isSelected = isAll
                ? selectedCategories.length === 0
                : selectedCategories.includes(chip)

              return (
                <button
                  key={chip}
                  onClick={() => handleCategoryClick(chip)}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all duration-150 inline-flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-teal text-white border-teal shadow-sm'
                      : 'bg-white text-text-secondary border-border-ui hover:border-teal/50 hover:text-teal'
                  }`}
                >
                  {!isAll && (
                    <span className="text-[11px] font-bold leading-none">
                      {isSelected ? '✓' : ''}
                    </span>
                  )}
                  {chip}
                </button>
              )
            })}
            {(selectedCategories.length > 0 || activeDiff !== 'All levels' || search) && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-text-secondary hover:text-teal px-2 py-1 transition-colors underline"
              >
                Reset filters
              </button>
            )}
          </div>
          {/* Difficulty filter */}
          <select
            value={activeDiff}
            onChange={e => setActiveDiff(e.target.value)}
            className="text-xs font-semibold border border-border-ui rounded-btn px-3 py-1.5 bg-white text-text-primary focus:outline-none focus:border-teal"
          >
            {difficultyOptions.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-semibold text-text-primary mb-1">No classes match your search</p>
            <p className="text-sm text-text-secondary mb-4">Try different filters or a broader search term.</p>
            {(selectedCategories.length > 0 || activeDiff !== 'All levels' || search) && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-teal hover:underline px-4 py-2 border border-teal/30 rounded-btn hover:bg-teal/10 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((cls, index) => {
              const isFull = cls.availableSeats < 1
              const diff = cls.level || 'Beginner'
              const isOwnClass = Boolean(currentUser?.email && cls.instructorEmail === currentUser.email)
              return (
                <div
                  key={index}
                  className={`group flex flex-col bg-white border rounded-card overflow-hidden transition-card hover-lift ${
                    isFull ? 'opacity-75' : 'border-border-ui'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative h-44 bg-surface-2 overflow-hidden">
                    {cls.image
                      ? <img src={cls.image} alt={cls.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                      : <div className="w-full h-full flex items-center justify-center text-4xl">🧘</div>
                    }
                    <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${difficultyBadge[diff] || difficultyBadge.Beginner}`}>
                      {diff}
                    </span>
                    {isFull && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-xs font-bold text-white bg-error px-2 py-1 rounded-full">Full</span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-sm font-bold text-text-primary mb-0.5 line-clamp-2">{cls.name}</h3>
                    <p className="text-xs text-text-secondary mb-2">{cls.instructorName}</p>

                    {/* Category badges */}
                    {cls.categories && Array.isArray(cls.categories) && cls.categories.filter((cat) => cat !== 'Beginner').length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {cls.categories.filter((cat) => cat !== 'Beginner').map((cat, i) => (
                          <span key={i} className="text-[10px] font-semibold bg-teal-50 text-teal px-2 py-0.5 rounded-full border border-teal/20">
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-xs text-text-secondary mb-4">
                      <span>{cls.availableSeats} seats left</span>
                      <span className="ml-auto font-bold text-text-primary">
                        {(cls.price ?? cls.Price) === 0 ? 'Free' : `₹${cls.price ?? cls.Price ?? 0}`}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => handleSelect(cls._id)}
                        disabled={role === 'admin' || isOwnClass || isFull}
                        title={isOwnClass ? "You teach this class" : ""}
                        className="flex-1 py-2 text-xs font-bold border border-teal text-teal rounded-btn hover:bg-teal hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
                      >
                        {isOwnClass ? 'Your Class' : 'Save'}
                      </button>
                      <Link to={`/class/${cls._id}`} className="flex-1">
                        <button className="w-full py-2 text-xs font-bold bg-teal text-white rounded-btn hover:bg-teal-600 transition-colors">
                          View class
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Classes
