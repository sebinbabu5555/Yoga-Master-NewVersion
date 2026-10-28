import React, { useEffect, useState } from 'react'
import useUser from '../../../hooks/useUser'
import useAxiosFetch from '../../../hooks/useAxiosFetch'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { Link } from 'react-router-dom'
import { FiUsers, FiAward, FiCheckCircle, FiFileText, FiAlertCircle } from 'react-icons/fi'

const MetricCard = ({ label, value, color, bg, icon }) => (
  <div className={`bg-white rounded-card border border-border-ui p-5 flex items-center gap-4`}>
    <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0 text-lg`}>
      {icon}
    </div>
    <div>
      <p className={`text-2xl font-bold ${color}`}>{value ?? '—'}</p>
      <p className="text-xs text-text-secondary mt-0.5 leading-snug">{label}</p>
    </div>
  </div>
)

const AdminHome = () => {
  const { currentUser } = useUser()
  const axiosFetch = useAxiosFetch()
  const axiosSecure = useAxiosSecure()
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)

  useEffect(() => {
    axiosFetch.get('/users')
      .then(res => setUsers(res.data))
      .catch(() => {})

    axiosSecure.get('/admin-stats')
      .then(res => setStats(res.data))
      .catch(() => {})
  }, [])

  const firstName = currentUser?.name?.split(' ')[0] || 'Admin'

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">
            Overview <span className="text-text-secondary font-normal text-lg">· Welcome back, {firstName}</span>
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">Here's what's happening on the platform today.</p>
        </div>
        <Link
          to="/dashboard/explore-classes"
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-border-ui bg-white hover:bg-surface-2 text-text-primary text-xs font-semibold rounded-btn transition-colors shadow-sm self-start sm:self-auto"
        >
          <span>Explore Classes</span>
          <span>→</span>
        </Link>
      </div>

      {/* Pending instructor application alert if any */}
      {(stats?.pendingApplications > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-card p-4 flex items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl flex-shrink-0">
              <FiAlertCircle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">
                {stats.pendingApplications} Instructor {stats.pendingApplications === 1 ? 'Application' : 'Applications'} Awaiting Review
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Prospective instructors have submitted credentials for your approval.
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/manage-applications"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-btn transition-colors whitespace-nowrap shadow-sm"
          >
            Review Applications →
          </Link>
        </div>
      )}

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Registered users"    value={users?.length}         color="text-navy"    bg="bg-teal-100"    icon={<FiUsers className="w-5 h-5 text-teal" />} />
        <MetricCard label="Active instructors"  value={stats?.instructors}    color="text-blue-ai" bg="bg-blue-ai-100" icon={<FiAward className="w-5 h-5 text-blue-ai" />} />
        <MetricCard label="Approved classes"    value={stats?.approvedClasses} color="text-teal"   bg="bg-teal-100"    icon={<FiCheckCircle className="w-5 h-5 text-teal" />} />
        <Link to="/dashboard/manage-applications" className="block hover:scale-[1.01] transition-transform">
          <MetricCard 
            label="Instructor applications" 
            value={stats?.pendingApplications !== undefined ? `${stats?.pendingApplications} pending` : '—'} 
            color="text-amber-600" 
            bg="bg-amber-100" 
            icon={<FiFileText className="w-5 h-5 text-amber-600" />} 
          />
        </Link>
      </div>

      {/* Users table preview */}
      <div className="bg-white rounded-card border border-border-ui overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-ui">
          <p className="text-sm font-bold text-navy">Recent Users</p>
          <Link to="/dashboard/manage-users" className="text-xs font-bold text-teal hover:text-teal-600 transition-colors">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-base text-xs text-text-secondary uppercase tracking-wide">
                <th className="px-5 py-3 text-left font-semibold">User</th>
                <th className="px-5 py-3 text-left font-semibold">Email</th>
                <th className="px-5 py-3 text-left font-semibold">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-ui">
              {users.slice(0, 5).map((user, i) => (
                <tr key={i} className="hover:bg-bg-base transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full object-cover border border-border-ui"/>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-teal text-xs font-bold">
                          {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <span className="font-medium text-text-primary text-xs">{user.name || '—'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-text-secondary text-xs">{user.email}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${
                      user.role === 'admin'      ? 'bg-coral-100 text-coral' :
                      user.role === 'instructor' ? 'bg-blue-ai-100 text-blue-ai' :
                                                   'bg-teal-100 text-teal'
                    }`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={3} className="px-5 py-8 text-center text-text-secondary text-xs">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminHome