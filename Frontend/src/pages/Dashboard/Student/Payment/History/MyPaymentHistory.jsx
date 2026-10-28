import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosFetch from "../../../../../hooks/useAxiosFetch";
import useAxiosSecure from "../../../../../hooks/useAxiosSecure";
import useUser from "../../../../../hooks/useUser";
import moment from 'moment';
import { FiDollarSign, FiCreditCard, FiCheckCircle, FiSearch, FiCalendar, FiUser, FiBookOpen } from 'react-icons/fi';

const MetricCard = ({ label, value, color, bg, icon }) => (
  <div className="bg-white rounded-card border border-border-ui p-5 flex items-center gap-4 shadow-sm">
    <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0 text-xl`}>
      {icon}
    </div>
    <div>
      <p className={`text-2xl font-bold ${color}`}>{value ?? '—'}</p>
      <p className="text-xs text-text-secondary mt-0.5 leading-snug">{label}</p>
    </div>
  </div>
);

const MyPaymentHistory = () => {
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();
  const { currentUser } = useUser();
  const role = currentUser?.role;
  const isInstructor = role === 'instructor';

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'earnings' | 'purchases'
  const itemsPerPage = 6;

  useEffect(() => {
    if (!currentUser?.email) return;
    setLoading(true);
    const endpoint = isInstructor 
      ? `/instructor-payments/${currentUser.email}`
      : `/payment-history/${currentUser.email}`;

    axiosFetch.get(endpoint)
      .then(res => {
        setPayments(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(() => {
        // Fallback to /payment-history
        axiosFetch.get(`/payment-history/${currentUser.email}`)
          .then(res => {
            setPayments(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      });
  }, [currentUser?.email, isInstructor]);

  const earningsPayments = payments.filter(p => p.isEarnings !== false);
  const purchasesPayments = payments.filter(p => p.isEarnings === false);
  const totalEarnings = earningsPayments.reduce((acc, curr) => acc + (Number(curr.amount) || Number(curr.price) || 0), 0);
  const totalSpent = purchasesPayments.reduce((acc, curr) => acc + (Number(curr.amount) || Number(curr.price) || 0), 0);
  const totalAmount = payments.reduce((acc, curr) => acc + (Number(curr.amount) || Number(curr.price) || 0), 0);
  const totalClassesCount = payments.reduce((acc, curr) => acc + (curr.classesId?.length || 1), 0);

  // Tab filter
  const tabFiltered = isInstructor
    ? payments.filter(p => {
        if (activeTab === 'earnings') return p.isEarnings !== false;
        if (activeTab === 'purchases') return p.isEarnings === false;
        return true;
      })
    : payments;

  // Search filter
  const filtered = tabFiltered.filter(p => {
    const q = search.toLowerCase();
    const matchTx = p.transactionId?.toLowerCase().includes(q);
    const matchClass = p.classNames?.toLowerCase().includes(q);
    const matchUser = p.userName?.toLowerCase().includes(q) || p.userEmail?.toLowerCase().includes(q);
    return matchTx || matchClass || matchUser;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-card border border-border-ui">
        <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-text-secondary">Loading payment records...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">
            {isInstructor ? 'Payment History & Earnings' : 'Payment History'}
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {isInstructor
              ? 'Track both student enrollments into your courses and classes you enrolled in as a practitioner.'
              : 'Review your enrolled course payments, receipts, and transaction history.'}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
          <input
            type="text"
            placeholder={isInstructor ? "Search student, tx ID, or class..." : "Search transaction ID or class..."}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-white border border-border-ui rounded-btn text-xs text-text-primary placeholder-text-secondary focus:outline-none focus:border-teal transition-all"
          />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isInstructor ? (
          <>
            <MetricCard
              label="Teaching Earnings"
              value={`₹${totalEarnings.toLocaleString()}`}
              color="text-teal"
              bg="bg-teal-100"
              icon="💰"
            />
            <MetricCard
              label="My Course Purchases"
              value={`₹${totalSpent.toLocaleString()}`}
              color="text-blue-ai"
              bg="bg-blue-ai-100"
              icon="🧘"
            />
            <MetricCard
              label="Total Transactions"
              value={payments.length}
              color="text-navy"
              bg="bg-surface-2"
              icon="🧾"
            />
          </>
        ) : (
          <>
            <MetricCard
              label="Total Paid"
              value={`₹${totalAmount.toLocaleString()}`}
              color="text-navy"
              bg="bg-teal-100"
              icon="💰"
            />
            <MetricCard
              label="Completed Payments"
              value={payments.length}
              color="text-blue-ai"
              bg="bg-blue-ai-100"
              icon="🧾"
            />
            <MetricCard
              label="Courses Purchased"
              value={totalClassesCount}
              color="text-coral"
              bg="bg-coral-100"
              icon="📈"
            />
          </>
        )}
      </div>

      {/* Instructor Filter Tabs */}
      {isInstructor && (
        <div className="flex items-center gap-2 border-b border-border-ui pb-2">
          <button
            onClick={() => { setActiveTab('all'); setPage(1); }}
            className={`px-3.5 py-1.5 rounded-btn text-xs font-bold transition-colors ${
              activeTab === 'all'
                ? 'bg-teal text-white shadow-sm'
                : 'text-text-secondary hover:text-navy hover:bg-surface-2'
            }`}
          >
            All Activity ({payments.length})
          </button>
          <button
            onClick={() => { setActiveTab('earnings'); setPage(1); }}
            className={`px-3.5 py-1.5 rounded-btn text-xs font-bold transition-colors ${
              activeTab === 'earnings'
                ? 'bg-teal text-white shadow-sm'
                : 'text-text-secondary hover:text-navy hover:bg-surface-2'
            }`}
          >
            Teaching Earnings ({earningsPayments.length})
          </button>
          <button
            onClick={() => { setActiveTab('purchases'); setPage(1); }}
            className={`px-3.5 py-1.5 rounded-btn text-xs font-bold transition-colors ${
              activeTab === 'purchases'
                ? 'bg-teal text-white shadow-sm'
                : 'text-text-secondary hover:text-navy hover:bg-surface-2'
            }`}
          >
            My Enrollments / Purchases ({purchasesPayments.length})
          </button>
        </div>
      )}

      {/* Transactions Table Card */}
      <div className="bg-white rounded-card border border-border-ui shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border-ui flex items-center justify-between">
          <p className="text-sm font-bold text-navy">
            {isInstructor
              ? activeTab === 'earnings'
                ? 'Teaching Earnings'
                : activeTab === 'purchases'
                ? 'My Learning & Course Purchases'
                : 'All Payment Records'
              : 'Payment Records'}
          </p>
          <span className="text-xs text-text-secondary font-medium">
            Showing {currentItems.length} of {filtered.length} entries
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-14 h-14 rounded-full bg-teal-50 text-teal flex items-center justify-center mx-auto text-2xl mb-3">
              <FiCreditCard className="w-7 h-7" />
            </div>
            <p className="font-bold text-navy text-base mb-1">
              {search ? 'No payments match your search' : 'No Payment Records Found'}
            </p>
            <p className="text-xs text-text-secondary max-w-sm mx-auto mb-4">
              {search
                ? 'Try a different search term or clear the filter.'
                : isInstructor
                ? 'When students enroll and pay for your courses, transaction receipts and earnings will appear here.'
                : 'You have not made any class payments yet. Explore classes to get started!'}
            </p>
            {search ? (
              <button
                onClick={() => setSearch('')}
                className="px-4 py-2 bg-teal text-white text-xs font-bold rounded-btn hover:bg-teal-600 transition-colors"
              >
                Clear Search
              </button>
            ) : (
              <Link
                to="/dashboard/explore-classes"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal text-white text-xs font-bold rounded-btn hover:bg-teal-600 transition-colors shadow-sm"
              >
                Explore Classes
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-bg-base text-[11px] font-bold text-text-secondary uppercase tracking-wider border-b border-border-ui">
                    <th className="px-5 py-3">#</th>
                    <th className="px-5 py-3">Course / Details</th>
                    {isInstructor && <th className="px-5 py-3">Student</th>}
                    <th className="px-5 py-3">Transaction ID</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-ui">
                  {currentItems.map((payment, idx) => {
                    const rawDate = payment.date || payment.submitted;
                    const dateFormatted = rawDate
                      ? moment(rawDate).format("MMM DD, YYYY · h:mm A")
                      : 'Recent';

                    return (
                      <tr key={payment._id || idx} className="hover:bg-surface-2 transition-colors">
                        <td className="px-5 py-3.5 text-text-secondary font-medium">
                          {startIndex + idx + 1}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-text-primary text-xs leading-snug">
                              {payment.classNames || 'Yoga Master Course'}
                            </p>
                            {isInstructor && (
                              payment.isEarnings !== false ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-600 flex-shrink-0">
                                  Earning
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-ai-100 text-blue-ai flex-shrink-0">
                                  Enrolled
                                </span>
                              )
                            )}
                          </div>
                          <span className="text-[10px] text-text-secondary">
                            {payment.classesId?.length ? `${payment.classesId.length} class item(s)` : '1 class'}
                          </span>
                        </td>
                        {isInstructor && (
                          <td className="px-5 py-3.5">
                            {payment.isEarnings === false ? (
                              <div>
                                <span className="font-semibold text-xs text-blue-ai">
                                  You (Self Enrollment)
                                </span>
                                <p className="text-[10px] text-text-secondary truncate max-w-[150px]">
                                  {payment.userEmail}
                                </p>
                              </div>
                            ) : (
                              <div>
                                <p className="font-semibold text-text-primary text-xs">
                                  {payment.userName || 'Student'}
                                </p>
                                <p className="text-[10px] text-text-secondary truncate max-w-[150px]">
                                  {payment.userEmail || '—'}
                                </p>
                              </div>
                            )}
                          </td>
                        )}
                        <td className="px-5 py-3.5">
                          <code className="text-[11px] px-2 py-0.5 rounded bg-surface-2 text-navy font-mono border border-border-ui">
                            {payment.transactionId || 'N/A'}
                          </code>
                        </td>
                        <td className="px-5 py-3.5 text-text-secondary whitespace-nowrap">
                          {dateFormatted}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-text-primary">
                          ₹{payment.amount}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal">
                            <FiCheckCircle className="w-3 h-3" />
                            Completed
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-5 py-3 border-t border-border-ui flex items-center justify-between bg-bg-base">
                <button
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 border border-border-ui rounded-btn text-xs font-semibold text-text-secondary hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-xs text-text-secondary font-medium">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 border border-border-ui rounded-btn text-xs font-semibold text-text-secondary hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyPaymentHistory;