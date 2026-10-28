import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import moment from 'moment'
import Swal from 'sweetalert2'
import {
  FiTrash2,
  FiEdit3,
  FiEye,
  FiAlertCircle,
  FiPlus,
  FiBookOpen,
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiX,
  FiLayers,
  FiRadio
} from 'react-icons/fi'
import useUser from '../../../hooks/useUser'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const statusMap = {
  approved: {
    label: 'Approved',
    badge: 'bg-success/10 text-success border-success/30',
    icon: FiCheckCircle
  },
  pending: {
    label: 'Pending Review',
    badge: 'bg-warning/10 text-warning border-warning/30',
    icon: FiClock
  },
  checking: {
    label: 'In Review',
    badge: 'bg-blue-ai-100 text-blue-ai border-blue-ai/30',
    icon: FiClock
  },
  rejected: {
    label: 'Rejected',
    badge: 'bg-error/10 text-error border-error/30',
    icon: FiXCircle
  }
}

const AVAILABLE_CATEGORIES = ['Strength', 'Mobility', 'Flexibility', 'Recovery', 'Posture', 'Core', 'Balance']
const LEVEL_OPTIONS = ['Beginner', 'Intermediate', 'Advanced']

const MyClasses = ({ filterStatus = 'all' }) => {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(filterStatus)
  const [deletingId, setDeletingId] = useState(null)
  const [editingClass, setEditingClass] = useState(null)
  const [editLevel, setEditLevel] = useState('Beginner')
  const [editCategories, setEditCategories] = useState([])
  const [isUpdating, setIsUpdating] = useState(false)

  const { currentUser, isLoading } = useUser()
  const navigate = useNavigate()
  const axiosSecure = useAxiosSecure()

  // Fetch classes added by the current instructor
  useEffect(() => {
    if (currentUser?.email) {
      setLoading(true)
      axiosSecure
        .get(`/classes/${currentUser.email}`)
        .then((res) => {
          setClasses(Array.isArray(res.data) ? res.data : [])
          setLoading(false)
        })
        .catch((err) => {
          console.error('Failed to fetch instructor classes:', err)
          setClasses([])
          setLoading(false)
        })
    } else if (!isLoading) {
      setLoading(false)
    }
  }, [currentUser?.email, isLoading])

  // Sync edit form state when editingClass changes
  useEffect(() => {
    if (editingClass) {
      setEditLevel(editingClass.level || 'Beginner')
      const cats = Array.isArray(editingClass.categories)
        ? editingClass.categories.filter((c) => c !== 'Beginner')
        : (editingClass.category && editingClass.category !== 'Beginner' ? [editingClass.category] : [])
      setEditCategories(cats)
    }
  }, [editingClass])

  const handleEditCategoryToggle = (category) => {
    setEditCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  // Handle class deletion
  const handleDeleteClass = (cls) => {
    Swal.fire({
      title: 'Delete Class?',
      html: `
        <p class="text-sm text-gray-600 mb-2">Are you sure you want to permanently delete <strong>"${cls.name}"</strong>?</p>
        <p class="text-xs text-red-500">This action cannot be undone. All class information will be removed.</p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E5484D',
      cancelButtonColor: '#667085',
      confirmButtonText: 'Yes, delete class',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeletingId(cls._id)
        try {
          const res = await axiosSecure.delete(`/delete-class/${cls._id}`)
          if (res.data?.deletedCount > 0 || res.status === 200) {
            setClasses((prev) => prev.filter((item) => item._id !== cls._id))
            Swal.fire({
              title: 'Deleted!',
              text: `"${cls.name}" has been removed.`,
              icon: 'success',
              confirmButtonColor: '#12B8A6',
              timer: 2000,
              showConfirmButton: false
            })
          } else {
            Swal.fire({
              title: 'Failed to delete',
              text: res.data?.message || 'Unable to delete the class. Please try again.',
              icon: 'error',
              confirmButtonColor: '#E5484D'
            })
          }
        } catch (err) {
          console.error('Error deleting class:', err)
          Swal.fire({
            title: 'Delete Failed',
            text: err.response?.data?.message || 'Something went wrong while deleting. Please try again.',
            icon: 'error',
            confirmButtonColor: '#E5484D'
          })
        } finally {
          setDeletingId(null)
        }
      }
    })
  }

  // Handle viewing feedback/reason
  const handleViewFeedback = (cls) => {
    Swal.fire({
      title: 'Admin Feedback',
      html: `
        <div class="text-left text-sm space-y-2 mt-2">
          <p><strong>Class:</strong> ${cls.name}</p>
          <p><strong>Status:</strong> <span class="capitalize font-semibold text-coral">${cls.status}</span></p>
          <div class="p-3 bg-surface-2 rounded-lg text-text-primary mt-3 border border-border-ui">
            <strong>Notes / Reason:</strong>
            <p class="mt-1">${cls.reason || 'No specific admin notes provided. Please ensure all required course details are accurate and adhere to platform guidelines.'}</p>
          </div>
        </div>
      `,
      icon: cls.status === 'rejected' ? 'warning' : 'info',
      confirmButtonColor: '#12B8A6',
      confirmButtonText: 'Close'
    })
  }

  // Handle submitting the update form modal
  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    if (!editingClass) return

    if (editCategories.length === 0) {
      Swal.fire({
        title: 'Category Required',
        text: 'Please select at least one category for your course.',
        icon: 'warning',
        confirmButtonColor: '#12B8A6'
      })
      return
    }

    setIsUpdating(true)
    const formData = new FormData(e.target)
    const updateData = {
      name: formData.get('name'),
      price: Number(formData.get('price')),
      availableSeats: parseInt(formData.get('availableSeats'), 10),
      videoLink: formData.get('videoLink'),
      description: formData.get('description'),
      level: editLevel,
      categories: editCategories
    }

    try {
      const res = await axiosSecure.put(`/update-class/${editingClass._id}`, updateData)
      if (res.data?.modifiedCount > 0 || res.status === 200) {
        setClasses((prev) =>
          prev.map((c) =>
            c._id === editingClass._id
              ? { ...c, ...updateData, status: 'pending' }
              : c
          )
        )
        setEditingClass(null)
        Swal.fire({
          title: 'Class Updated!',
          text: 'Your class details have been updated and submitted for review.',
          icon: 'success',
          confirmButtonColor: '#12B8A6'
        })
      } else {
        setEditingClass(null)
      }
    } catch (err) {
      console.error('Error updating class:', err)
      Swal.fire({
        title: 'Update Failed',
        text: err.response?.data?.message || 'Could not update class.',
        icon: 'error',
        confirmButtonColor: '#E5484D'
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Filtered classes according to selected tab
  const filteredClasses = classes.filter((cls) => {
    if (activeTab === 'all') return true
    return cls.status === activeTab
  })

  const countByStatus = {
    all: classes.length,
    approved: classes.filter((c) => c.status === 'approved').length,
    pending: classes.filter((c) => c.status === 'pending' || c.status === 'checking').length,
    rejected: classes.filter((c) => c.status === 'rejected').length
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy">
            My <span className="text-teal">Classes</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage your courses, view student enrollment, edit details, or delete classes.
          </p>
        </div>
        <Link
          to="/dashboard/add-class"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal text-white font-semibold rounded-btn shadow-sm hover:bg-teal-600 transition-colors text-sm self-start sm:self-auto"
        >
          <FiPlus className="w-4 h-4" />
          <span>Create New Class</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border-ui pb-3">
        {[
          { key: 'all', label: 'All Classes', count: countByStatus.all },
          { key: 'approved', label: 'Approved', count: countByStatus.approved },
          { key: 'pending', label: 'Pending', count: countByStatus.pending },
          { key: 'rejected', label: 'Rejected', count: countByStatus.rejected }
        ].map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-navy text-white shadow-sm'
                  : 'bg-white text-text-secondary hover:text-text-primary hover:bg-surface-2 border border-border-ui'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-surface-2 text-text-secondary'
                }`}
              >
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-card border border-border-ui">
          <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-medium text-text-secondary">Loading your classes...</p>
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="bg-white rounded-card border border-border-ui p-10 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-teal-100 text-teal flex items-center justify-center mx-auto text-2xl">
            <FiBookOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-navy">
              {classes.length === 0 ? 'No classes created yet' : 'No classes match this filter'}
            </h3>
            <p className="text-sm text-text-secondary max-w-md mx-auto mt-1">
              {classes.length === 0
                ? 'Start teaching on Yoga Master by adding your first yoga course today!'
                : `You currently have 0 classes under "${activeTab}".`}
            </p>
          </div>
          {classes.length === 0 && (
            <Link
              to="/dashboard/add-class"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal text-white font-semibold text-sm rounded-btn hover:bg-teal-600 transition-colors shadow-sm"
            >
              <FiPlus className="w-4 h-4" />
              <span>Create Your First Class</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.map((cls) => {
            const statusConfig = statusMap[cls.status] || statusMap.pending
            const StatusIcon = statusConfig.icon
            const price = cls.price ?? cls.Price ?? 0
            const isDeleting = deletingId === cls._id

            return (
              <div
                key={cls._id}
                className="bg-white rounded-card border border-border-ui shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Card Header & Image */}
                  <div className="relative aspect-[16/9] w-full bg-surface-2 overflow-hidden">
                    {cls.image ? (
                      <img
                        src={cls.image}
                        alt={cls.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-teal-100 text-teal">
                        <FiLayers className="w-10 h-10 opacity-70" />
                        <span className="text-xs font-semibold mt-1">Yoga Class</span>
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md bg-white/95 ${statusConfig.badge} shadow-sm`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span>{statusConfig.label}</span>
                      </span>
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-3 left-3 bg-navy/90 text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-sm backdrop-blur-sm">
                      ₹{price}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    <h2
                      className="font-bold text-navy text-base leading-snug line-clamp-2 hover:text-teal transition-colors"
                      title={cls.name}
                    >
                      {cls.name}
                    </h2>

                    {/* Level and Category Badges */}
                    {(cls.level || (cls.categories && Array.isArray(cls.categories) && cls.categories.filter((cat) => cat !== 'Beginner').length > 0)) && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        {cls.level && (
                          <span className="text-[10px] font-bold bg-teal-100 text-teal px-2 py-0.5 rounded-full">
                            {cls.level}
                          </span>
                        )}
                        {cls.categories && Array.isArray(cls.categories) && cls.categories.filter((cat) => cat !== 'Beginner').map((cat, i) => (
                          <span key={i} className="text-[10px] bg-teal-50 text-teal font-semibold px-2 py-0.5 rounded-full border border-teal/20">
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}

                    {cls.description && (
                      <p className="text-xs text-text-secondary line-clamp-2">
                        {cls.description}
                      </p>
                    )}

                    {/* Class Metrics */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-ui text-xs">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <FiUsers className="w-4 h-4 text-teal" />
                        <span>
                          <strong className="text-text-primary">{cls.totalEnrolled || 0}</strong>{' '}
                          students
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-text-secondary">
                        <FiBookOpen className="w-4 h-4 text-blue-ai" />
                        <span>
                          <strong className="text-text-primary">{cls.availableSeats ?? '—'}</strong>{' '}
                          seats
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-text-secondary col-span-2">
                        <FiCalendar className="w-4 h-4 text-coral" />
                        <span>
                          Submitted:{' '}
                          <span className="text-text-primary font-medium">
                            {cls.submitted
                              ? moment(cls.submitted).format('MMM D, YYYY')
                              : 'Recently'}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Feedback Callout if rejected or note exists */}
                    {(cls.status === 'rejected' || cls.reason) && (
                      <div
                        onClick={() => handleViewFeedback(cls)}
                        className="cursor-pointer flex items-center justify-between p-2 rounded-lg bg-error/10 border border-error/20 text-error text-xs hover:bg-error/15 transition-colors"
                      >
                        <span className="flex items-center gap-1.5 font-medium">
                          <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">View admin feedback</span>
                        </span>
                        <span className="text-[11px] underline font-semibold">View</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-3 bg-bg-base border-t border-border-ui flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* View Details on public page */}
                    <button
                      onClick={() => navigate(`/class/${cls._id}`)}
                      title="View Course Page"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-text-primary bg-white border border-border-ui rounded-btn hover:bg-surface-2 transition-colors"
                    >
                      <FiEye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">View</span>
                    </button>

                    {/* Edit / Update Button */}
                    <button
                      onClick={() => setEditingClass(cls)}
                      title="Edit Course Details"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-teal bg-teal-100 rounded-btn hover:bg-teal hover:text-white transition-colors"
                    >
                      <FiEdit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {/* Go Live Studio Button for Approved Classes */}
                    {cls.status === 'approved' && (
                      <Link
                        to={`/dashboard/live-class/${cls._id}`}
                        title="Start Live Studio Session (Up to 50 Yogis)"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-white bg-coral hover:bg-red-600 rounded-btn transition-colors shadow-sm"
                      >
                        <FiRadio className="w-3.5 h-3.5" />
                        <span>{cls.liveStatus === 'live' ? 'Live Now' : 'Go Live'}</span>
                      </Link>
                    )}
                  </div>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={() => handleDeleteClass(cls)}
                    disabled={isDeleting}
                    title="Delete Class"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-error bg-error/10 border border-error/20 rounded-btn hover:bg-error hover:text-white disabled:opacity-50 transition-all duration-150"
                  >
                    {isDeleting ? (
                      <div className="w-3.5 h-3.5 border-2 border-error border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FiTrash2 className="w-3.5 h-3.5" />
                    )}
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Edit Class Modal */}
      {editingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-card max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border-ui">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-border-ui sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-bold text-navy">Edit Course Details</h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Updating this course will submit it for admin re-approval.
                </p>
              </div>
              <button
                onClick={() => setEditingClass(null)}
                className="text-text-secondary hover:text-text-primary p-1.5 rounded-lg hover:bg-surface-2 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingClass.name}
                  className="w-full px-3 py-2 text-sm border border-border-ui rounded-btn focus:outline-none focus:border-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    step="any"
                    required
                    defaultValue={editingClass.price ?? editingClass.Price ?? 0}
                    className="w-full px-3 py-2 text-sm border border-border-ui rounded-btn focus:outline-none focus:border-teal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Available Seats
                  </label>
                  <input
                    type="number"
                    name="availableSeats"
                    required
                    defaultValue={editingClass.availableSeats || 20}
                    className="w-full px-3 py-2 text-sm border border-border-ui rounded-btn focus:outline-none focus:border-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1" htmlFor="edit-course-level">
                    Course Level
                  </label>
                  <select
                    id="edit-course-level"
                    name="level"
                    value={editLevel}
                    onChange={(e) => setEditLevel(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-border-ui rounded-btn focus:outline-none focus:border-teal bg-white"
                  >
                    {LEVEL_OPTIONS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    YouTube Video Link
                  </label>
                  <input
                    type="text"
                    name="videoLink"
                    defaultValue={editingClass.videoLink || ''}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 text-sm border border-border-ui rounded-btn focus:outline-none focus:border-teal"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-text-primary">
                    Categories
                  </label>
                  <span className="text-[11px] font-medium text-teal">
                    {editCategories.length} selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 p-2.5 bg-surface-2/60 rounded-btn border border-border-ui/80">
                  {AVAILABLE_CATEGORIES.map((category) => {
                    const isChecked = editCategories.includes(category)
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleEditCategoryToggle(category)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
                          isChecked
                            ? 'bg-teal text-white border-teal shadow-xs'
                            : 'bg-white text-text-secondary border-border-ui hover:border-teal hover:text-text-primary'
                        }`}
                      >
                        {isChecked ? `✓ ${category}` : `+ ${category}`}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Course Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={editingClass.description || ''}
                  className="w-full px-3 py-2 text-sm border border-border-ui rounded-btn focus:outline-none focus:border-teal resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-ui">
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
                  className="px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary rounded-btn transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 text-xs font-bold text-white bg-teal hover:bg-teal-600 rounded-btn shadow-sm disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                  {isUpdating && (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyClasses