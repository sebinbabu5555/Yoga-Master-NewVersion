import React, { useEffect, useState } from 'react'
import useAxiosFetch from '../../../hooks/useAxiosFetch'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import Swal from 'sweetalert2'

const statusConfig = {
  pending:  { label: 'Pending',  cls: 'bg-warning/10 text-warning border-warning/30' },
  approved: { label: 'Approved', cls: 'bg-success/10 text-success border-success/30' },
  rejected: { label: 'Rejected', cls: 'bg-error/10 text-error border-error/30' },
  checking: { label: 'Checking', cls: 'bg-blue-ai-100 text-blue-ai border-blue-ai/30' },
}

const ITEMS_PER_PAGE = 8

const ManageClasses = () => {
  const axiosFetch = useAxiosFetch()
  const axiosSecure = useAxiosSecure()
  const [classes, setClasses] = useState([])
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(classes.length / ITEMS_PER_PAGE)
  const start = (page - 1) * ITEMS_PER_PAGE
  const paginatedData = classes.slice(start, start + ITEMS_PER_PAGE)

  useEffect(() => {
    axiosFetch.get('/classes-manage')
      .then(res => setClasses(res.data))
      .catch(() => {})
  }, [])

  const updateLocalStatus = (id, status) => {
    setClasses(prev => prev.map(c => c._id === id ? { ...c, status } : c))
  }

  const handleApprove = (id) => {
    axiosSecure.put(`/change-status/${id}`, { status: 'approved' })
      .then(() => {
        updateLocalStatus(id, 'approved')
        Swal.fire({ title: 'Approved!', text: 'Class is now live.', icon: 'success', confirmButtonColor: '#12B8A6' })
      })
      .catch(() => {})
  }

  const handleReject = (id) => {
    Swal.fire({
      title: 'Unpublish this class?',
      text: 'The instructor will be notified.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E5484D',
      cancelButtonColor: '#667085',
      confirmButtonText: 'Yes, unpublish',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.put(`/change-status/${id}`, { status: 'rejected', reason: 'rejected' })
          if (res.data.modifiedCount > 0) {
            updateLocalStatus(id, 'rejected')
            Swal.fire({ title: 'Unpublished', text: 'Class has been rejected.', icon: 'success', confirmButtonColor: '#12B8A6' })
          }
        } catch { /* handled */ }
      }
    })
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy">Manage classes</h1>
        <p className="text-sm text-text-secondary mt-0.5">{classes.length} total classes on the platform</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-card border border-border-ui overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-base text-xs text-text-secondary uppercase tracking-wide border-b border-border-ui">
                <th className="px-5 py-3 text-left font-semibold">Class</th>
                <th className="px-5 py-3 text-left font-semibold">Instructor</th>
                <th className="px-5 py-3 text-left font-semibold">Category & Level</th>
                <th className="px-5 py-3 text-left font-semibold">Status</th>
                <th className="px-5 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-ui">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-text-secondary text-sm">
                    <p className="text-3xl mb-2">📚</p>
                    No classes found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((cls) => {
                  const status = statusConfig[cls.status] || statusConfig.pending
                  return (
                    <tr key={cls._id} className="hover:bg-bg-base transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-surface-2 overflow-hidden flex-shrink-0">
                            {cls.image
                              ? <img src={cls.image} alt="" className="w-full h-full object-cover"/>
                              : <div className="w-full h-full flex items-center justify-center text-lg">🧘</div>
                            }
                          </div>
                          <span className="font-semibold text-text-primary text-xs line-clamp-2 max-w-[180px]">{cls.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-text-secondary text-xs">{cls.instructorName || '—'}</td>
                      <td className="px-5 py-3 text-xs">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-text-primary">
                            {cls.level || 'Beginner'}
                          </span>
                          {cls.categories && Array.isArray(cls.categories) && cls.categories.filter((cat) => cat !== 'Beginner').length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-[180px]">
                              {cls.categories.filter((cat) => cat !== 'Beginner').map((cat, i) => (
                                <span key={i} className="text-[10px] bg-teal-50 text-teal font-medium px-1.5 py-0.5 rounded border border-teal/20">
                                  {cat}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-text-secondary text-[11px]">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${status.cls}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(cls._id)}
                            disabled={cls.status === 'approved'}
                            className="text-xs font-bold px-3 py-1.5 bg-success/10 text-success border border-success/30 rounded-btn hover:bg-success hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(cls._id)}
                            disabled={cls.status === 'rejected'}
                            className="text-xs font-bold px-3 py-1.5 bg-error/10 text-error border border-error/30 rounded-btn hover:bg-error hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border-ui">
            <p className="text-xs text-text-secondary">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs font-semibold border border-border-ui rounded-btn text-text-primary hover:border-teal hover:text-teal disabled:opacity-40 transition-all"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs font-semibold border border-border-ui rounded-btn text-text-primary hover:border-teal hover:text-teal disabled:opacity-40 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageClasses