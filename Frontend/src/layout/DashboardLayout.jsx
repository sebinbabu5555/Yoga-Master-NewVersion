import React, { useState } from 'react'
import useAuth from '../hooks/useAuth'
import useUser from '../hooks/useUser'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import Scroll from '../hooks/useScroll'
import { HashLoader } from 'react-spinners'
import AIAssistantModal from '../components/AIAssistant/AIAssistantModal'

// ── Nav items per role ──────────────────────────────────────
// ── Nav items per role ──────────────────────────────────────
const adminNavItems = [
  { isDivider: true, label: 'Admin Controls' },
  { to: '/dashboard/admin-home',          label: 'Overview',        icon: IconGrid },
  { to: '/dashboard/manage-users',        label: 'Users',           icon: IconUsers },
  { to: '/dashboard/manage-class',        label: 'Classes',         icon: IconBook },
  { to: '/dashboard/manage-applications', label: 'Applications',    icon: IconBadge },
  { to: '/dashboard/profile',             label: 'Profile & Settings', icon: IconUser },
  { isDivider: true, label: 'Explore & Browse' },
  { to: '/dashboard/explore-classes',     label: 'Explore Classes', icon: IconCompass },
  { to: '/dashboard/instructors',         label: 'Instructors',     icon: IconInstructor },
]

const instructorNavItems = [
  { isDivider: true, label: 'Teaching' },
  { to: '/dashboard/instructor-cp',      label: 'Teaching Overview',  icon: IconGrid },
  { to: '/dashboard/add-class',          label: 'Create Class',       icon: IconPlus },
  { to: '/dashboard/my-classes',         label: 'Manage My Classes',  icon: IconBook },
  { isDivider: true, label: 'My Practice & Learning' },
  { to: '/dashboard/student-cp',         label: 'Practice Hub',       icon: IconHome },
  { to: '/dashboard/recommendations',    label: 'Recommendations',    icon: IconSparkles },
  { to: '/dashboard/personal-training',  label: '1-to-1 Coaching',    icon: IconCalendar },
  { to: '/dashboard/training-plan',      label: 'Free Goal Programs', icon: IconTarget },
  { to: '/dashboard/profile',            label: 'Profile & Settings', icon: IconUser },
  { to: '/dashboard/enrolled-class',     label: 'My Training',        icon: IconPlay },
  { to: '/dashboard/my-selected',        label: 'Saved Classes',      icon: IconBookmark },
  { to: '/dashboard/my-payments',        label: 'Payment History',    icon: IconCard },
  { isDivider: true, label: 'Explore & Community' },
  { to: '/dashboard/explore-classes',    label: 'Explore Classes',    icon: IconCompass },
  { to: '/dashboard/instructors',        label: 'Instructors',        icon: IconInstructor },
]

const studentNavItems = [
  { isDivider: true, label: 'My Practice & Learning' },
  { to: '/dashboard/student-cp',         label: 'Home',               icon: IconGrid },
  { to: '/dashboard/recommendations',    label: 'Recommendations',    icon: IconSparkles },
  { to: '/dashboard/personal-training',  label: '1-to-1 Coaching',    icon: IconCalendar },
  { to: '/dashboard/training-plan',      label: 'Free Goal Programs', icon: IconTarget },
  { to: '/dashboard/profile',            label: 'Profile & Settings', icon: IconUser },
  { to: '/dashboard/enrolled-class',     label: 'My Training',        icon: IconPlay },
  { to: '/dashboard/my-selected',        label: 'Saved Classes',      icon: IconBookmark },
  { to: '/dashboard/my-payments',        label: 'Payments',           icon: IconCard },
  { isDivider: true, label: 'Explore & Community' },
  { to: '/dashboard/explore-classes',    label: 'Explore Classes',    icon: IconCompass },
  { to: '/dashboard/instructors',        label: 'Instructors',        icon: IconInstructor },
  { to: '/dashboard/apply-instructor',   label: 'Become an Instructor', icon: IconBadge },
]

// ── Inline SVG Icons ────────────────────────────────────────
function IconGrid()       { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/></svg> }
function IconSparkles()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z"/></svg> }
function IconUser()       { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> }
function IconCompass()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor"/></svg> }
function IconInstructor() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> }
function IconUsers()      { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2"/></svg> }
function IconBook()       { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="2"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="2"/></svg> }
function IconPlay()       { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M10 8l6 4-6 4V8z" fill="currentColor"/></svg> }
function IconBookmark()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function IconCard()       { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M1 10h22" stroke="currentColor" strokeWidth="2"/></svg> }
function IconBadge()      { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg> }
function IconCalendar()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }
function IconTarget()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> }
function IconPlus()       { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> }
function IconHome()       { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="2"/><path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="2"/></svg> }
function IconLogout()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2"/><polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/></svg> }


// ── NavItem component ────────────────────────────────────────
const NavItem = ({ to, label, icon: Icon, collapsed }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
        isActive
          ? 'bg-teal text-white shadow-sm'
          : 'text-[#667085] hover:bg-[#EEF2F5] hover:text-[#17202A]'
      }`
    }
  >
    <span className="flex-shrink-0 w-4 h-4"><Icon /></span>
    {!collapsed && <span className="origin-left transition-all duration-200">{label}</span>}
  </NavLink>
)

// ── Main DashboardLayout ─────────────────────────────────────
const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [isAIOpen, setIsAIOpen] = useState(false)
  const { logout } = useAuth()
  const { currentUser, isLoading } = useUser()
  const navigate = useNavigate()
  const role = currentUser?.role


  const navItems =
    role === 'admin'      ? adminNavItems :
    role === 'instructor' ? instructorNavItems :
                            studentNavItems

  const handleLogOut = () => {
    Swal.fire({
      title: 'Log out?',
      text: "You'll need to sign back in.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#12B8A6',
      cancelButtonColor: '#667085',
      confirmButtonText: 'Yes, log out',
    }).then((result) => {
      if (result.isConfirmed) {
        logout()
          .then(() => navigate('/'))
          .catch((err) => console.error(err))
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-base">
        <HashLoader color="#12B8A6" size={40} />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden">
      {/* ── Sidebar ──────────────────────────────── */}
      <aside
        className={`${
          collapsed ? 'w-16' : 'w-60'
        } hidden md:flex flex-col bg-white border-r border-border-ui pt-5 pb-4 transition-all duration-250 flex-shrink-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 mb-6">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center flex-shrink-0 hover:bg-teal-600 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              {collapsed
                ? <path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                : <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              }
            </svg>
          </button>
          {!collapsed && (
            <Link to="/" className="text-navy font-bold text-base whitespace-nowrap overflow-hidden">
              Yoga Master
            </Link>
          )}
        </div>

        {/* Role badge */}
        {!collapsed && (
          <div className="px-4 mb-4">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
              role === 'admin'      ? 'bg-coral-100 text-coral' :
              role === 'instructor' ? 'bg-blue-ai-100 text-blue-ai' :
                                     'bg-teal-100 text-teal'
            }`}>
              {role === 'admin' ? 'Admin' : role === 'instructor' ? 'Instructor' : 'Member'}
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item, idx) =>
            item.isDivider ? (
              !collapsed ? (
                <div key={idx} className="pt-3 pb-1 px-3 first:pt-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">{item.label}</p>
                </div>
              ) : (
                <div key={idx} className="my-1.5 border-t border-border-ui/60 first:hidden" />
              )
            ) : (
              <NavItem key={item.to} {...item} collapsed={collapsed} />
            )
          )}
        </nav>

        {/* Bottom links */}
        <div className="px-3 pt-3 border-t border-border-ui space-y-0.5">
          <NavItem to="/" label="Back to Home" icon={IconHome} collapsed={collapsed} />
          <button
            onClick={handleLogOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-error hover:bg-red-50 transition-all duration-150"
          >
            <span className="flex-shrink-0 w-4 h-4"><IconLogout /></span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex-shrink-0 h-14 bg-white border-b border-border-ui flex items-center justify-between px-6">
          <Link to="/dashboard/profile" className="flex items-center gap-3 group">
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-border-ui group-hover:ring-2 group-hover:ring-teal transition-all" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-white text-sm font-bold group-hover:bg-teal-600 transition-colors">
                {currentUser?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-text-primary leading-tight group-hover:text-teal transition-colors">{currentUser?.name || 'User'}</p>
              <p className="text-xs text-text-secondary capitalize">{role}</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-secondary hidden md:block">{currentUser?.email}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-6 py-6 relative">
          <Scroll />
          <Outlet />
        </main>

        {/* Floating AI Coach Trigger - Elegant athletic design apt to Yoga Master */}
        <button
          onClick={() => setIsAIOpen(true)}
          aria-label="Open AI Coach"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 bg-navy hover:bg-navy-800 text-white rounded-full shadow-lg shadow-navy/20 border border-teal/40 hover:border-teal transition-all duration-200 group cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-teal group-hover:scale-110 transition-transform">
              <path
                d="M12 2L14.7 7.7L21 8.5L16.2 12.8L17.6 19L12 15.8L6.4 19L7.8 12.8L3 8.5L9.3 7.7L12 2Z"
                fill="currentColor"
              />
            </svg>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-teal rounded-full animate-ping opacity-75" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-teal rounded-full" />
          </div>
          <span className="text-xs font-bold tracking-tight text-white group-hover:text-teal transition-colors">
            AI Coach
          </span>
        </button>

        {/* AI Assistant Modal */}
        <AIAssistantModal
          isOpen={isAIOpen}
          onClose={() => setIsAIOpen(false)}
        />
      </div>
    </div>
  )
}

export default DashboardLayout

