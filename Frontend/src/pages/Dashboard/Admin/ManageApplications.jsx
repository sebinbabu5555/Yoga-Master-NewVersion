import React, { useEffect, useState } from 'react'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import Swal from 'sweetalert2'
import { 
  FiCheck, 
  FiX, 
  FiClock, 
  FiSearch, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiFileText, 
  FiTrash2, 
  FiEye,
  FiAlertCircle
} from 'react-icons/fi'

const statusConfig = {
  pending: {
    label: 'Pending Review',
    badgeCls: 'bg-amber-50 text-amber-700 border-amber-200',
    dotCls: 'bg-amber-500'
  },
  approved: {
    label: 'Approved',
    badgeCls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotCls: 'bg-emerald-500'
  },
  rejected: {
    label: 'Rejected',
    badgeCls: 'bg-rose-50 text-rose-700 border-rose-200',
    dotCls: 'bg-rose-500'
  }
}

const UserAvatar = ({ photo, name, size = 'w-10 h-10' }) => {
  const [imgError, setImgError] = useState(false)
  const initial = name ? name[0].toUpperCase() : 'U'
  if (photo && !imgError) {
    return (
      <img
        src={photo}
        alt={name || 'User'}
        onError={() => setImgError(true)}
        className={`${size} rounded-full object-cover border border-border-ui flex-shrink-0`}
      />
    )
  }
  return (
    <div className={`${size} rounded-full bg-teal-100 text-teal font-bold flex items-center justify-center text-sm uppercase shadow-sm flex-shrink-0`}>
      {initial}
    </div>
  )
}

const ManageApplications = () => {
  const axiosSecure = useAxiosSecure()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all') // 'all' | 'pending' | 'approved' | 'rejected'
  const [selectedApp, setSelectedApp] = useState(null) // for modal view

  const fetchApplications = () => {
    setLoading(true)
    axiosSecure.get('/applied-instructors')
      .then(res => {
        setApplications(res.data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching applications:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  // Stats
  const totalCount = applications.length
  const pendingCount = applications.filter(a => (a.status || 'pending') === 'pending').length
  const approvedCount = applications.filter(a => a.status === 'approved').length
  const rejectedCount = applications.filter(a => a.status === 'rejected').length

  // Filtered applications
  const filteredApps = applications.filter(app => {
    const status = app.status || 'pending'
    const matchesFilter = activeFilter === 'all' || status === activeFilter
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch = !q || 
      (app.name && app.name.toLowerCase().includes(q)) ||
      (app.email && app.email.toLowerCase().includes(q)) ||
      (app.experience && app.experience.toLowerCase().includes(q))
    return matchesFilter && matchesSearch
  })

  // Approve Handler
  const handleApprove = (app) => {
    Swal.fire({
      title: 'Approve Application?',
      text: `Are you sure you want to approve ${app.name || app.email}? This will upgrade their account role to Instructor.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#12B8A6',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Yes, Approve',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/applied-instructors/approve/${app._id}`)
          if (res.data.success) {
            Swal.fire({
              title: 'Approved!',
              text: `${app.name || app.email} is now an Instructor.`,
              icon: 'success',
              confirmButtonColor: '#12B8A6'
            })
            // Update local state
            setApplications(prev => prev.map(a => a._id === app._id ? { ...a, status: 'approved' } : a))
            if (selectedApp?._id === app._id) {
              setSelectedApp(prev => ({ ...prev, status: 'approved' }))
            }
          }
        } catch (err) {
          Swal.fire('Error', err.response?.data?.message || 'Failed to approve application', 'error')
        }
      }
    })
  }

  // Reject Handler
  const handleReject = (app) => {
    Swal.fire({
      title: 'Reject Application',
      text: `Provide optional feedback or reason for rejecting ${app.name || app.email}:`,
      input: 'textarea',
      inputPlaceholder: 'e.g. Needs at least 200 hours of registered yoga teacher certification...',
      showCancelButton: true,
      confirmButtonColor: '#E11D48',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Reject Application',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        // Optional, but encourage context
        return null
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const reason = result.value || 'Application not accepted at this time.'
          const res = await axiosSecure.patch(`/applied-instructors/reject/${app._id}`, { reason })
          if (res.data.success) {
            Swal.fire({
              title: 'Rejected',
              text: 'The application has been marked as rejected.',
              icon: 'info',
              confirmButtonColor: '#12B8A6'
            })
            setApplications(prev => prev.map(a => a._id === app._id ? { ...a, status: 'rejected', feedback: reason } : a))
            if (selectedApp?._id === app._id) {
              setSelectedApp(prev => ({ ...prev, status: 'rejected', feedback: reason }))
            }
          }
        } catch (err) {
          Swal.fire('Error', err.response?.data?.message || 'Failed to reject application', 'error')
        }
      }
    })
  }

  // Delete Handler
  const handleDelete = (app) => {
    Swal.fire({
      title: 'Delete Record?',
      text: `Remove this application record for ${app.name || app.email}? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E11D48',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/applied-instructors/${app._id}`)
          if (res.data.success) {
            Swal.fire('Deleted!', 'Application record removed.', 'success')
            setApplications(prev => prev.filter(a => a._id !== app._id))
            if (selectedApp?._id === app._id) setSelectedApp(null)
          }
        } catch (err) {
          Swal.fire('Error', err.response?.data?.message || 'Failed to delete record', 'error')
        }
      }
    })
  }

  const formatDate = (dateVal) => {
    if (!dateVal) return 'Recent'
    try {
      return new Date(dateVal).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return 'Recent'
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Instructor Applications</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Review applicant credentials and approve or reject prospective instructors.
          </p>
        </div>
        <button
          onClick={fetchApplications}
          className="inline-flex items-center gap-2 px-4 py-2 border border-border-ui bg-white hover:bg-surface-2 text-text-primary text-xs font-semibold rounded-btn transition-colors shadow-sm self-start sm:self-auto"
        >
          <FiClock className="w-3.5 h-3.5 text-text-secondary" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveFilter('all')}
          className={`cursor-pointer bg-white rounded-card border transition-all p-4 ${
            activeFilter === 'all' ? 'border-teal ring-2 ring-teal/20 shadow-sm' : 'border-border-ui hover:border-text-secondary/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-secondary">All Applications</span>
            <span className="w-8 h-8 rounded-lg bg-teal-100/60 text-teal flex items-center justify-center text-sm font-bold">
              📋
            </span>
          </div>
          <p className="text-2xl font-bold text-navy mt-2">{totalCount}</p>
        </div>

        <div 
          onClick={() => setActiveFilter('pending')}
          className={`cursor-pointer bg-white rounded-card border transition-all p-4 ${
            activeFilter === 'pending' ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-sm' : 'border-border-ui hover:border-text-secondary/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-secondary">Pending Review</span>
            <span className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-700 flex items-center justify-center text-sm font-bold">
              ⏳
            </span>
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">{pendingCount}</p>
        </div>

        <div 
          onClick={() => setActiveFilter('approved')}
          className={`cursor-pointer bg-white rounded-card border transition-all p-4 ${
            activeFilter === 'approved' ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm' : 'border-border-ui hover:border-text-secondary/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-secondary">Approved</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center text-sm font-bold">
              ✅
            </span>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{approvedCount}</p>
        </div>

        <div 
          onClick={() => setActiveFilter('rejected')}
          className={`cursor-pointer bg-white rounded-card border transition-all p-4 ${
            activeFilter === 'rejected' ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-sm' : 'border-border-ui hover:border-text-secondary/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-secondary">Rejected</span>
            <span className="w-8 h-8 rounded-lg bg-rose-100/70 text-rose-700 flex items-center justify-center text-sm font-bold">
              ❌
            </span>
          </div>
          <p className="text-2xl font-bold text-rose-600 mt-2">{rejectedCount}</p>
        </div>
      </div>

      {/* Control bar: search + filter tabs */}
      <div className="bg-white rounded-card border border-border-ui p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All', count: totalCount },
            { id: 'pending', label: 'Pending', count: pendingCount },
            { id: 'approved', label: 'Approved', count: approvedCount },
            { id: 'rejected', label: 'Rejected', count: rejectedCount }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeFilter === tab.id
                  ? 'bg-navy text-white shadow-sm'
                  : 'text-text-secondary hover:bg-surface-2 hover:text-navy'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeFilter === tab.id ? 'bg-white/20 text-white' : 'bg-surface-2 text-text-secondary'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, email, experience..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-border-ui rounded-btn text-xs text-navy placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-secondary hover:text-navy"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-card border border-border-ui overflow-hidden shadow-sm">
        {loading ? (
          <div className="text-center py-20 text-text-secondary">
            <div className="inline-block w-8 h-8 border-3 border-teal border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm">Loading applications...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-14 h-14 bg-surface-2 rounded-2xl mx-auto flex items-center justify-center text-2xl mb-3 text-text-secondary">
              📬
            </div>
            <h3 className="text-base font-bold text-navy">No applications found</h3>
            <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No applications matched "${searchQuery}". Try adjusting your keywords.`
                : activeFilter !== 'all'
                ? `There are currently no ${activeFilter} instructor applications.`
                : 'No candidates have submitted an application yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-bg-base text-[11px] font-semibold text-text-secondary uppercase tracking-wider border-b border-border-ui">
                  <th className="px-5 py-3.5">Applicant</th>
                  <th className="px-5 py-3.5">Experience & Credentials</th>
                  <th className="px-5 py-3.5">Submitted</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-ui">
                {filteredApps.map((app) => {
                  const status = app.status || 'pending'
                  const cfg = statusConfig[status] || statusConfig.pending

                  return (
                    <tr key={app._id} className="hover:bg-surface-1/50 transition-colors">
                      {/* Applicant info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar photo={app.userPhoto} name={app.name} size="w-10 h-10" />
                          <div>
                            <p className="font-bold text-navy text-sm">{app.name || 'Unnamed Applicant'}</p>
                            <div className="flex items-center gap-2 text-xs text-text-secondary mt-0.5">
                              <span className="flex items-center gap-1">
                                <FiMail className="w-3 h-3" />
                                {app.email}
                              </span>
                              {app.userPhone && (
                                <span className="flex items-center gap-1">
                                  · <FiPhone className="w-3 h-3" />
                                  {app.userPhone}
                                </span>
                              )}
                            </div>
                            {app.currentRole && (
                              <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-surface-2 text-text-secondary uppercase font-semibold">
                                Role: {app.currentRole}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Experience snippet */}
                      <td className="px-5 py-4 max-w-xs">
                        <p className="text-xs text-text-primary line-clamp-2 leading-relaxed">
                          {app.experience || 'No description provided.'}
                        </p>
                        {app.experience && app.experience.length > 90 && (
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="text-[11px] text-teal font-semibold hover:underline mt-1 inline-flex items-center gap-0.5"
                          >
                            <FiEye className="w-3 h-3" /> Read more
                          </button>
                        )}
                        {app.feedback && status === 'rejected' && (
                          <div className="mt-1.5 p-2 rounded bg-rose-50 border border-rose-100 text-[11px] text-rose-700">
                            <span className="font-bold">Feedback:</span> {app.feedback}
                          </div>
                        )}
                      </td>

                      {/* Submitted Date */}
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-text-secondary">
                        {formatDate(app.submittedAt)}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.badgeCls}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotCls}`}></span>
                          {cfg.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => setSelectedApp(app)}
                            title="View Full Details"
                            className="p-1.5 rounded-lg border border-border-ui text-text-secondary hover:text-navy hover:bg-surface-2 transition-colors"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>

                          {status !== 'approved' && (
                            <button
                              onClick={() => handleApprove(app)}
                              title="Approve Applicant"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-teal hover:bg-teal-600 text-white text-xs font-semibold rounded-btn transition-colors shadow-sm"
                            >
                              <FiCheck className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}

                          {status !== 'rejected' && (
                            <button
                              onClick={() => handleReject(app)}
                              title="Reject Application"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 rounded-btn transition-colors"
                            >
                              <FiX className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(app)}
                            title="Delete Record"
                            className="p-1.5 rounded-lg border border-transparent text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail / Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-card max-w-xl w-full border border-border-ui shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-ui bg-bg-base">
              <div className="flex items-center gap-2">
                <FiFileText className="w-5 h-5 text-teal" />
                <h3 className="font-bold text-navy text-base">Application Review</h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-white hover:text-navy transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Applicant Card */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-1 border border-border-ui">
                <UserAvatar photo={selectedApp.userPhoto} name={selectedApp.name} size="w-14 h-14" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4 className="font-bold text-navy text-base">{selectedApp.name || 'Applicant'}</h4>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      statusConfig[selectedApp.status || 'pending']?.badgeCls
                    }`}>
                      {statusConfig[selectedApp.status || 'pending']?.label}
                    </span>
                  </div>
                  <div className="mt-1.5 space-y-1 text-xs text-text-secondary">
                    <p className="flex items-center gap-1.5">
                      <FiMail className="w-3.5 h-3.5 text-teal" />
                      <span className="text-text-primary font-medium">{selectedApp.email}</span>
                    </p>
                    {selectedApp.userPhone && (
                      <p className="flex items-center gap-1.5">
                        <FiPhone className="w-3.5 h-3.5 text-teal" />
                        <span>{selectedApp.userPhone}</span>
                      </p>
                    )}
                    <p className="flex items-center gap-1.5">
                      <FiClock className="w-3.5 h-3.5 text-teal" />
                      <span>Submitted on {formatDate(selectedApp.submittedAt)}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Experience & Background */}
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">
                  Experience & Yoga Qualifications
                </label>
                <div className="p-4 rounded-xl bg-bg-base border border-border-ui text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                  {selectedApp.experience || 'No description provided.'}
                </div>
              </div>

              {/* Rejection / Feedback details if any */}
              {selectedApp.feedback && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs mb-1">
                    <FiAlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Admin Feedback / Reason</span>
                  </div>
                  <p className="text-xs text-rose-700 leading-relaxed">
                    {selectedApp.feedback}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 border-t border-border-ui bg-bg-base flex items-center justify-between gap-3">
              <button
                onClick={() => handleDelete(selectedApp)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 px-3 py-2 rounded-btn hover:bg-rose-50 transition-colors"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                <span>Delete Application</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 border border-border-ui bg-white hover:bg-surface-2 text-text-primary text-xs font-semibold rounded-btn transition-colors"
                >
                  Close
                </button>
                {selectedApp.status !== 'approved' && (
                  <button
                    onClick={() => handleApprove(selectedApp)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal hover:bg-teal-600 text-white text-xs font-semibold rounded-btn transition-colors shadow-sm"
                  >
                    <FiCheck className="w-4 h-4" />
                    <span>Approve Candidate</span>
                  </button>
                )}
                {selectedApp.status !== 'rejected' && (
                  <button
                    onClick={() => handleReject(selectedApp)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-btn transition-colors shadow-sm"
                  >
                    <FiX className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageApplications
