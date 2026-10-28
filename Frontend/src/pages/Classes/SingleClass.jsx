import React, { useState, useEffect } from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useUser from '../../hooks/useUser';
import useAuth from '../../hooks/useAuth';
import useAxiosFetch from '../../hooks/useAxiosFetch';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import ReactPlayer from 'react-player';

import {
  FaStar,
  FaRegStar,
  FaCheckCircle,
  FaPlay,
  FaUser,
  FaUsers,
  FaShieldAlt,
  FaVideo,
  FaClock,
  FaGraduationCap,
  FaShareAlt,
  FaArrowLeft,
  FaAward,
  FaPaperPlane,
  FaCheck
} from 'react-icons/fa';
import { MdVerified, MdLiveTv } from 'react-icons/md';

const difficultyBadge = {
  Beginner: 'bg-teal/10 text-teal border border-teal/20',
  Intermediate: 'bg-coral/10 text-coral border border-coral/20',
  Advanced: 'bg-blue-ai/10 text-blue-ai border border-blue-ai/20',
  'All levels': 'bg-teal/10 text-teal border border-teal/20',
};

const SingleClass = () => {
  const course = useLoaderData();
  const { currentUser } = useUser();
  const { user } = useAuth();
  const role = currentUser?.role;
  const navigate = useNavigate();

  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();

  // State
  const [activeTab, setActiveTab] = useState('overview');
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all');

  // Check enrollment
  useEffect(() => {
    if (currentUser?.email) {
      axiosSecure.get(`/enrolled-classes/${currentUser.email}`)
        .then(res => setEnrolledClasses(res.data || []))
        .catch(() => {});
    }
  }, [currentUser?.email]);

  // Load reviews from backend
  useEffect(() => {
    if (course?._id) {
      axiosFetch.get(`/reviews/${course._id}`)
        .then(res => {
          if (Array.isArray(res.data)) {
            setReviews(res.data);
          }
        })
        .catch(() => {});
    }
  }, [course?._id]);

  // Load related courses
  useEffect(() => {
    axiosFetch.get('/popular_classes')
      .then(res => {
        if (Array.isArray(res.data)) {
          const others = res.data.filter(c => c._id !== course?._id).slice(0, 3);
          setRelatedCourses(others);
        }
      })
      .catch(() => {});
  }, [course?._id]);

  if (!course) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-card shadow-sm border border-border-ui">
          <div className="w-12 h-12 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-navy mb-2">Loading Class Details</h2>
          <p className="text-text-secondary text-sm">Please wait while we fetch the session data...</p>
        </div>
      </div>
    );
  }

  // Enrollment checks
  const isEnrolled = enrolledClasses.some(item => {
    return item.classes?._id === course._id || item.classesId?.includes(course._id);
  });
  const isFull = (course.availableSeats || 0) < 1;
  const courseLevel = course.level || 'Beginner';
  const isOwnClass = Boolean(currentUser?.email && course?.instructorEmail === currentUser.email);

  // Compute Review Statistics
  // If no reviews yet, use authentic initial placeholder reviews for social proof
  const initialDefaultReviews = [
    {
      _id: 'default-1',
      userName: 'Priya Sharma',
      rating: 5,
      comment: 'Exceptional instruction! The breathwork and posture alignment cues transformed my morning flow. Highly recommended for all practitioners.',
      date: '2026-09-15T10:00:00.000Z',
      isVerified: true
    },
    {
      _id: 'default-2',
      userName: 'Rahul Nair',
      rating: 5,
      comment: 'The live interactive mass session was completely seamless. The instructor answers questions and gives real-time corrections. Loved it!',
      date: '2026-09-18T14:30:00.000Z',
      isVerified: true
    }
  ];

  const displayReviews = reviews.length > 0 ? reviews : initialDefaultReviews;
  const totalReviewsCount = displayReviews.length;
  const avgRating = totalReviewsCount > 0
    ? (displayReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / totalReviewsCount).toFixed(1)
    : '5.0';

  const countForStar = (star) => displayReviews.filter(r => Math.round(Number(r.rating)) === star).length;

  const filteredReviews = displayReviews.filter(r => {
    if (reviewFilter === 'all') return true;
    if (reviewFilter === 'verified') return r.isVerified;
    return Math.round(Number(r.rating)) === Number(reviewFilter);
  });

  // Handle Enrollment / Cart
  const handleEnrollNow = () => {
    if (!currentUser) {
      toast.error('Please sign in to enroll in this class');
      navigate('/login');
      return;
    }
    if (role === 'admin') {
      toast.warn("Admins cannot enroll in classes");
      return;
    }
    if (isOwnClass) {
      toast.warn("You teach this class and cannot enroll in your own course");
      return;
    }
    if (isEnrolled) {
      toast.info('You are already enrolled! Entering your Live Studio...');
      navigate(`/dashboard/live-class/${course._id}`);
      return;
    }
    if (isFull) {
      toast.error('This class is currently full (0 seats remaining)');
      return;
    }

    axiosSecure.get(`/cart-item/${course._id}?email=${currentUser.email}`)
      .then(res => {
        if (res.data?.classId === course._id) {
          toast.info('Class is already in your cart! Taking you to checkout...');
          navigate('/dashboard/my-selected');
        } else {
          const payload = {
            classId: course._id,
            userMail: currentUser.email,
            date: new Date()
          };
          axiosSecure.post('/add-to-cart', payload)
            .then(() => {
              toast.success('Added to your cart! Proceeding to checkout...');
              setTimeout(() => {
                navigate('/dashboard/my-selected');
              }, 600);
            })
            .catch(() => toast.error('Could not add to cart. Please try again.'));
        }
      })
      .catch(() => toast.error('Error verifying class status'));
  };

  const handleSaveForLater = () => {
    if (!currentUser) {
      toast.error('Please sign in to save this class');
      return;
    }
    if (role === 'admin') {
      toast.warn("Admins cannot save classes");
      return;
    }
    if (isOwnClass) {
      toast.warn("You teach this class and cannot save your own course");
      return;
    }
    if (isEnrolled) {
      toast.info('You are already enrolled in this class');
      return;
    }

    axiosSecure.get(`/cart-item/${course._id}?email=${currentUser.email}`)
      .then(res => {
        if (res.data?.classId === course._id) {
          toast.info('Already saved in your selected classes');
        } else {
          axiosSecure.post('/add-to-cart', {
            classId: course._id,
            userMail: currentUser.email,
            date: new Date()
          })
            .then(() => toast.success('Saved to your dashboard!'))
            .catch(() => toast.error('Could not save class'));
        }
      })
      .catch(() => toast.error('Error saving class'));
  };

  // Handle Review Submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please sign in to leave feedback');
      navigate('/login');
      return;
    }
    if (!reviewRating) {
      toast.warn('Please select a star rating (1 to 5)');
      return;
    }
    if (!reviewComment.trim()) {
      toast.warn('Please enter your feedback comment');
      return;
    }

    setSubmittingReview(true);
    try {
      const payload = {
        classId: course._id,
        rating: Number(reviewRating),
        comment: reviewComment.trim(),
        userName: currentUser.name || user?.displayName || currentUser.email?.split('@')[0] || 'Yoga Practitioner',
        userPhoto: currentUser.photoUrl || user?.photoURL || null
      };

      const res = await axiosSecure.post('/add-review', payload);
      if (res.data.success) {
        toast.success('Thank you! Your feedback has been published.');
        setReviewComment('');
        // Refresh reviews from backend
        const updated = await axiosFetch.get(`/reviews/${course._id}`);
        if (Array.isArray(updated.data)) {
          setReviews(updated.data);
        }
      } else {
        toast.error(res.data.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toast.success('Class link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base font-sans pb-16">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* ── Top Header / Hero Section (Midnight Navy) ── */}
      <div className="pt-24 pb-12 bg-navy text-white relative overflow-hidden border-b border-white/10">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-coral/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-white/60 mb-4 flex-wrap">
            <Link to="/" className="hover:text-teal transition-colors">Home</Link>
            <span>/</span>
            <Link to="/classes" className="hover:text-teal transition-colors">Classes</Link>
            <span>/</span>
            <span className="text-white line-clamp-1">{course.name}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${difficultyBadge[courseLevel] || difficultyBadge.Beginner}`}>
              {courseLevel}
            </span>
            {course?.categories && Array.isArray(course.categories) && course.categories.filter((cat) => cat !== 'Beginner').map((cat, i) => (
              <span key={i} className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/10">
                {cat}
              </span>
            ))}
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/10 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal animate-pulse"></span>
              Live Mass Studio (50 seats)
            </span>
            {isEnrolled && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal text-white flex items-center gap-1">
                <FaCheckCircle className="text-xs" /> Enrolled Practitioner
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-4 max-w-4xl leading-snug">
            {course.name}
          </h1>

          {/* Meta Info Bar */}
          <div className="flex flex-wrap items-center gap-5 sm:gap-8 text-xs sm:text-sm text-white/80 pt-2 border-t border-white/10">
            {/* Instructor */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-teal/20 text-teal flex items-center justify-center font-bold text-xs uppercase border border-teal/40">
                {course.instructorName ? course.instructorName.charAt(0) : 'Y'}
              </div>
              <div>
                <span className="text-white/50 text-[11px] block">Instructor</span>
                <span className="font-semibold text-white">{course.instructorName || 'Yoga Master'}</span>
              </div>
            </div>

            {/* Ratings */}
            <button
              onClick={() => {
                setActiveTab('reviews');
                const el = document.getElementById('class-tabs');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 hover:text-teal transition-colors cursor-pointer group"
            >
              <div className="flex text-amber-400 text-sm">
                <FaStar />
              </div>
              <span className="font-bold text-white group-hover:text-teal transition-colors">{avgRating}</span>
              <span className="text-white/60 group-hover:text-teal/80 transition-colors">({totalReviewsCount} reviews)</span>
            </button>

            {/* Total Enrolled */}
            <div className="flex items-center gap-2">
              <FaUsers className="text-teal" />
              <span>{course.totalEnrolled || 0} enrolled</span>
            </div>

            {/* Seats Availability */}
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isFull ? 'bg-error' : course.availableSeats < 5 ? 'bg-coral animate-ping' : 'bg-success'}`} />
              <span className={isFull ? 'text-coral font-bold' : 'text-white/90'}>
                {isFull ? 'Sold Out' : `${course.availableSeats} seats remaining`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content Grid ── */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── Left Column (Main Details & Tabs) ── */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Media Banner / Video Preview */}
            <div className="relative h-[320px] sm:h-[420px] rounded-card overflow-hidden bg-navy-800 shadow-md border border-border-ui group">
              <img
                src={course.image || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80'}
                alt={course.name}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Play Video Trigger Overlay */}
              {course.videoLink && (
                <button
                  onClick={() => setShowVideoModal(true)}
                  className="absolute inset-0 flex items-center justify-center group/btn"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-teal/90 text-white flex items-center justify-center shadow-xl group-hover/btn:scale-110 group-hover/btn:bg-teal transition-all duration-200">
                    <FaPlay className="text-xl sm:text-2xl ml-1" />
                  </div>
                  <span className="absolute bottom-6 left-6 text-white text-sm font-semibold flex items-center gap-2 bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-sm">
                    <FaVideo className="text-teal" /> Preview Session Video
                  </span>
                </button>
              )}

              {/* Tag Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${difficultyBadge[courseLevel] || difficultyBadge.Beginner}`}>
                  {courseLevel}
                </span>
              </div>
            </div>

            {/* Video Modal if active */}
            {showVideoModal && course.videoLink && (
              <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="relative w-full max-w-4xl bg-navy rounded-card overflow-hidden shadow-2xl border border-white/20">
                  <div className="p-4 flex items-center justify-between border-b border-white/10 text-white">
                    <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                      <FaVideo className="text-teal" /> Course Video Preview
                    </h3>
                    <button
                      onClick={() => setShowVideoModal(false)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="relative pt-[56.25%] bg-black">
                    <ReactPlayer
                      url={course.videoLink}
                      controls
                      playing
                      width="100%"
                      height="100%"
                      className="absolute top-0 left-0"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Tab Bar */}
            <div id="class-tabs" className="border-b border-border-ui flex gap-2 sm:gap-6 overflow-x-auto text-sm font-semibold scroll-mt-28">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'curriculum', label: 'Curriculum & Poses' },
                { id: 'instructor', label: 'Instructor Bio' },
                { id: 'reviews', label: `Reviews & Feedback (${totalReviewsCount})` },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 pt-1 whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-teal text-teal font-bold'
                      : 'border-transparent text-text-secondary hover:text-navy'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Tab Content ── */}
            <div className="bg-white rounded-card border border-border-ui p-6 sm:p-8 shadow-sm">
              
              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy mb-4">About This Course</h2>
                    <p className="text-text-secondary leading-relaxed text-sm sm:text-base whitespace-pre-line">
                      {course.description ||
                        `Welcome to ${course.name}. This comprehensive yoga practice is designed to harmonize breath, strengthen the physical core, and elevate flexibility. Under the personalized direction of ${course.instructorName || 'our master trainer'}, you will cultivate mind-body awareness in a supportive, live digital studio.`}
                    </p>
                  </div>

                  {/* Highlights Grid */}
                  <div>
                    <h3 className="text-lg font-bold text-navy mb-4">What You Will Achieve</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { title: 'Asana Alignment & Posture', desc: 'Master foundational poses with precision and spinal health cues.' },
                        { title: 'Pranayama & Breath Control', desc: 'Harness vital energy and reduce stress with ancient yogic breathwork.' },
                        { title: 'Core Strength & Mobility', desc: 'Build lean functional strength, joint mobility, and balance.' },
                        { title: 'Restoration & Mindfulness', desc: 'Cultivate mental tranquility through guided meditation and Savasana.' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex gap-3 p-4 rounded-card bg-surface-2/60 border border-border-ui">
                          <div className="flex-none mt-0.5 text-teal">
                            <FaCheckCircle className="text-lg" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-navy">{item.title}</h4>
                            <p className="text-xs text-text-secondary mt-1">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Requirements / Essentials */}
                  <div>
                    <h3 className="text-lg font-bold text-navy mb-3">Practice Essentials</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      {[
                        { label: 'Yoga Mat', icon: '🧘' },
                        { label: 'Hydration', icon: '💧' },
                        { label: 'Comfort Wear', icon: '👕' },
                        { label: 'Quiet Space', icon: '🌿' },
                      ].map((req, i) => (
                        <div key={i} className="p-3 bg-surface-2/40 border border-border-ui rounded-btn">
                          <span className="text-2xl block mb-1">{req.icon}</span>
                          <span className="text-xs font-semibold text-text-primary">{req.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live Mass Class Features */}
                  <div className="bg-gradient-to-r from-teal-100/50 to-blue-ai-100/30 p-5 rounded-card border border-teal/20 flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-teal text-white flex items-center justify-center flex-none text-xl shadow-sm">
                      <MdLiveTv />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="font-bold text-navy text-sm sm:text-base">Real-Time Mass Live Studio (50 Seats)</h4>
                      <p className="text-xs text-navy-700 mt-1">
                        Connect with {course.instructorName || 'your trainer'} and fellow practitioners worldwide with high-definition audio, video, and posture feedback.
                      </p>
                    </div>
                    {isEnrolled && (
                      <Link to={`/dashboard/live-class/${course._id}`}>
                        <button className="px-4 py-2 bg-teal hover:bg-teal-600 text-white rounded-btn text-xs font-bold transition shadow-sm whitespace-nowrap">
                          Launch Live Room
                        </button>
                      </Link>
                    )}
                  </div>

                  {/* Student Feedback Snapshot in Overview */}
                  <div className="pt-2 border-t border-border-ui">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-navy">Practitioner Feedback</h3>
                        <p className="text-xs text-text-secondary">Rated {avgRating} out of 5 based on {totalReviewsCount} community reviews</p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('reviews');
                          const el = document.getElementById('class-tabs');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-xs font-bold text-teal hover:text-teal-600 transition flex items-center gap-1"
                      >
                        View all reviews or share your feedback &rarr;
                      </button>
                    </div>

                    {displayReviews.length > 0 && (
                      <div className="p-4 rounded-card bg-surface-2/40 border border-border-ui">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-navy">{displayReviews[0].userName}</span>
                            {displayReviews[0].isVerified && (
                              <span className="text-[10px] font-bold text-teal bg-teal-100 px-2 py-0.5 rounded-full">
                                ✓ Verified
                              </span>
                            )}
                          </div>
                          <div className="flex text-amber-400 text-xs">
                            {[1, 2, 3, 4, 5].map(st => (
                              <FaStar
                                key={st}
                                className={st <= Math.round(Number(displayReviews[0].rating)) ? 'text-amber-400' : 'text-gray-200'}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-text-secondary italic">
                          "{displayReviews[0].comment}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Curriculum & Poses */}
              {activeTab === 'curriculum' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy mb-2">Practice Curriculum</h2>
                    <p className="text-sm text-text-secondary mb-6">
                      A progressive 4-phase sequence designed to prepare, strengthen, stretch, and integrate your body.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        phase: 'Phase 1: Centering & Warm-Up',
                        time: '15 Minutes',
                        desc: 'Pranayama breathing techniques, gentle joint warm-up, and 5 rounds of Surya Namaskar (Sun Salutations).',
                        items: ['Pranayama Breathwork', 'Cat-Cow Flow', 'Sun Salutation A & B']
                      },
                      {
                        phase: 'Phase 2: Core Strengthening & Standing Flows',
                        time: '25 Minutes',
                        desc: 'Warrior series, Triangle pose, and core stability sequences to build heat, balance, and endurance.',
                        items: ['Warrior I & II Sequences', 'Utkatasana (Chair Pose)', 'Navasana Core Flow']
                      },
                      {
                        phase: 'Phase 3: Deep Stretch & Hip Openers',
                        time: '15 Minutes',
                        desc: 'Restorative hip openers, spinal twists, and backbends to release built-up physical tension.',
                        items: ['Pigeon Pose (Eka Pada)', 'Seated Spinal Twist', 'Bridge Pose (Setu Bandha)']
                      },
                      {
                        phase: 'Phase 4: Savasana & Guided Meditation',
                        time: '10 Minutes',
                        desc: 'Complete nervous system reset, cooling restorative postures, and silent meditative integration.',
                        items: ['Guided Body Scan', 'Corpse Pose (Savasana)', 'Closing Dedication']
                      },
                    ].map((phase, idx) => (
                      <div key={idx} className="border border-border-ui rounded-card p-5 hover:border-teal/50 transition-colors">
                        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                          <h3 className="font-bold text-navy text-sm sm:text-base flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-teal/15 text-teal text-xs flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>
                            {phase.phase}
                          </h3>
                          <span className="text-xs font-semibold text-text-secondary bg-surface-2 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <FaClock className="text-teal" /> {phase.time}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary mb-3">{phase.desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {phase.items.map((it, i) => (
                            <span key={i} className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-surface-2 text-navy-700 border border-border-ui">
                              ✓ {it}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Instructor Bio */}
              {activeTab === 'instructor' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-border-ui">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-teal to-blue-ai text-white flex items-center justify-center text-3xl font-extrabold shadow-md flex-none border-4 border-white">
                      {course.instructorName ? course.instructorName.charAt(0) : 'Y'}
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                        <h2 className="text-2xl font-bold text-navy">{course.instructorName || 'Master Trainer'}</h2>
                        <MdVerified className="text-teal text-xl" title="Verified Instructor" />
                      </div>
                      <p className="text-xs text-text-secondary mb-3">{course.instructorEmail}</p>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-100 text-teal">
                          Certified Yoga Master
                        </span>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-surface-2 text-text-secondary border border-border-ui">
                          500+ Hours RYT
                        </span>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-ai-100 text-blue-ai">
                          Interactive Live Host
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-navy mb-2">Instructor Philosophy</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      "Yoga is more than physical movement; it is a sacred technology for mental stillness, emotional balance, and physical resilience. Every session is designed to meet practitioners where they are, offering modifications for newcomers while inspiring seasoned yogis to explore deeper alignments."
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 4: Reviews & Feedback */}
              {activeTab === 'reviews' && (
                <div className="space-y-8">
                  {/* Reviews Summary Section */}
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy mb-2">Student Reviews & Ratings</h2>
                    <p className="text-sm text-text-secondary mb-6">
                      Explore authentic feedback and reflections from community practitioners.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-surface-2/40 border border-border-ui rounded-card p-6">
                      {/* Overall Score */}
                      <div className="md:col-span-4 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-border-ui pb-6 md:pb-0 md:pr-6">
                        <span className="text-5xl font-black text-navy mb-2">{avgRating}</span>
                        <div className="flex text-amber-400 text-lg mb-2">
                          {[1, 2, 3, 4, 5].map(st => (
                            <FaStar
                              key={st}
                              className={st <= Math.round(Number(avgRating)) ? 'text-amber-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-text-secondary">
                          Based on {totalReviewsCount} practitioner ratings
                        </span>
                      </div>

                      {/* Breakdown Bars */}
                      <div className="md:col-span-8 flex flex-col justify-center space-y-2">
                        {[5, 4, 3, 2, 1].map(stars => {
                          const count = countForStar(stars);
                          const pct = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
                          return (
                            <div key={stars} className="flex items-center gap-3 text-xs">
                              <span className="w-12 font-semibold text-text-secondary flex items-center gap-1">
                                {stars} <FaStar className="text-amber-400 text-[10px]" />
                              </span>
                              <div className="flex-1 h-2 rounded-full bg-border-ui overflow-hidden">
                                <div
                                  className="h-full bg-teal rounded-full transition-all duration-500"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="w-12 text-right font-medium text-text-secondary">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* ── Write Review / Feedback Form ── */}
                  <div className="bg-white rounded-card border border-teal/30 p-6 sm:p-7 shadow-sm">
                    <h3 className="text-lg font-bold text-navy mb-1 flex items-center gap-2">
                      <FaAward className="text-teal" /> Share Your Experience & Feedback
                    </h3>
                    <p className="text-xs text-text-secondary mb-4">
                      Your feedback helps our instructors refine classes and guides fellow practitioners on their journey.
                    </p>

                    {currentUser ? (
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        {/* Interactive Star Picker */}
                        <div>
                          <label className="block text-xs font-bold text-navy mb-2">Select Your Rating</label>
                          <div className="flex items-center gap-2">
                            <div className="flex text-2xl gap-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  type="button"
                                  key={star}
                                  onClick={() => setReviewRating(star)}
                                  onMouseEnter={() => setHoverRating(star)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  className="transition-transform hover:scale-125 focus:outline-none"
                                >
                                  <FaStar
                                    className={`${
                                      star <= (hoverRating || reviewRating)
                                        ? 'text-amber-400'
                                        : 'text-gray-200'
                                    } transition-colors`}
                                  />
                                </button>
                              ))}
                            </div>
                            <span className="text-xs font-bold text-navy-700 ml-2">
                              {hoverRating === 5 || reviewRating === 5 ? '5 - Excellent' :
                               hoverRating === 4 || reviewRating === 4 ? '4 - Very Good' :
                               hoverRating === 3 || reviewRating === 3 ? '3 - Good' :
                               hoverRating === 2 || reviewRating === 2 ? '2 - Fair' : '1 - Poor'}
                            </span>
                          </div>
                        </div>

                        {/* Feedback Textarea */}
                        <div>
                          <label className="block text-xs font-bold text-navy mb-2">Your Review & Thoughts</label>
                          <textarea
                            rows="4"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="How was the pacing, instructor guidance, music, and energy? What did you enjoy most about the practice?"
                            className="w-full px-4 py-3 rounded-btn border border-border-ui text-sm focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal text-navy placeholder:text-text-secondary/60"
                            required
                          />
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-text-secondary">
                            Posting as <strong className="text-navy">{currentUser.name || currentUser.email}</strong>
                          </span>
                          <button
                            type="submit"
                            disabled={submittingReview}
                            className="px-6 py-2.5 bg-teal hover:bg-teal-600 text-white rounded-btn text-xs font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-50"
                          >
                            {submittingReview ? (
                              <>
                                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Submitting...
                              </>
                            ) : (
                              <>
                                <FaPaperPlane className="text-xs" /> Submit Feedback
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="p-5 bg-surface-2 rounded-btn border border-border-ui text-center">
                        <p className="text-sm font-semibold text-navy mb-3">
                          Sign in to leave a review and rate your practice experience.
                        </p>
                        <Link to="/login">
                          <button className="px-5 py-2 bg-navy hover:bg-navy-800 text-white text-xs font-bold rounded-btn transition">
                            Sign In to Write a Review
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* ── Reviews Filter & Feed ── */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border-ui pb-3">
                      <h3 className="font-bold text-navy text-sm sm:text-base">
                        Practitioner Reflections ({filteredReviews.length})
                      </h3>
                      {/* Filter chips */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {['all', '5', '4', 'verified'].map(f => (
                          <button
                            key={f}
                            onClick={() => setReviewFilter(f)}
                            className={`text-xs px-3 py-1 rounded-full font-semibold transition ${
                              reviewFilter === f
                                ? 'bg-navy text-white'
                                : 'bg-surface-2 text-text-secondary hover:text-navy'
                            }`}
                          >
                            {f === 'all' ? 'All Reviews' : f === 'verified' ? 'Verified Enrolled' : `${f} Stars`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {filteredReviews.length === 0 ? (
                      <div className="text-center py-10 text-text-secondary text-sm">
                        No reviews found for this filter.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredReviews.map((rev, idx) => (
                          <div
                            key={rev._id || idx}
                            className="p-5 rounded-card border border-border-ui bg-surface-2/30 hover:border-teal/40 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex items-center gap-3">
                                {rev.userPhoto ? (
                                  <img
                                    src={rev.userPhoto}
                                    alt={rev.userName}
                                    className="w-10 h-10 rounded-full object-cover border border-border-ui"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-teal/20 text-teal font-bold flex items-center justify-center text-sm border border-teal/30">
                                    {rev.userName ? rev.userName.charAt(0).toUpperCase() : 'U'}
                                  </div>
                                )}
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-navy text-sm">{rev.userName || 'Yoga Student'}</h4>
                                    {rev.isVerified && (
                                      <span className="text-[11px] font-bold text-teal flex items-center gap-1 bg-teal-100 px-2 py-0.5 rounded-full">
                                        <MdVerified /> Verified Practitioner
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-text-secondary">
                                    {rev.date ? new Date(rev.date).toLocaleDateString() : 'Recent'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex text-amber-400 text-xs">
                                {[1, 2, 3, 4, 5].map(st => (
                                  <FaStar
                                    key={st}
                                    className={st <= Math.round(Number(rev.rating)) ? 'text-amber-400' : 'text-gray-200'}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs sm:text-sm text-text-primary/90 mt-2 leading-relaxed">
                              "{rev.comment}"
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* ── Right Column: Sticky Enrollment Sidebar ── */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Main Action & Pricing Card */}
            <div className="bg-white rounded-card border border-border-ui shadow-md p-6 sticky top-24 space-y-6">
              
              {/* Price & Seats Available */}
              <div className="border-b border-border-ui pb-5">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1">
                  Tuition Fee
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl sm:text-4xl font-black text-navy">
                    {course.price === 0 ? 'Free' : `₹${course.price}`}
                  </span>
                  <span className="text-xs text-text-secondary">Inclusive of all taxes</span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="font-semibold text-text-secondary">Studio Capacity:</span>
                  <span className={`font-bold ${isFull ? 'text-coral' : 'text-teal'}`}>
                    {isFull ? 'Sold Out (0 seats)' : `${course.availableSeats} of 50 seats open`}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {isOwnClass ? (
                  <>
                    <Link to="/dashboard/my-classes" className="block">
                      <button className="w-full py-3.5 px-4 bg-navy hover:bg-slate-800 text-white font-bold rounded-btn text-sm transition-all shadow-md flex items-center justify-center gap-2">
                        Manage Your Course
                      </button>
                    </Link>
                    <Link to={`/dashboard/live-class/${course._id}`} className="block">
                      <button className="w-full py-2.5 px-4 border border-teal text-teal hover:bg-teal hover:text-white font-bold rounded-btn text-xs transition-all flex items-center justify-center gap-2">
                        <MdLiveTv className="text-sm" />
                        Host Live Session
                      </button>
                    </Link>
                  </>
                ) : isEnrolled ? (
                  <Link to={`/dashboard/live-class/${course._id}`} className="block">
                    <button className="w-full py-3.5 px-4 bg-teal hover:bg-teal-600 text-white font-bold rounded-btn text-sm transition-all shadow-md flex items-center justify-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                      Enter Live Class Studio
                    </button>
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={handleEnrollNow}
                      disabled={isFull || role === 'admin'}
                      className="w-full py-3.5 px-4 bg-teal hover:bg-teal-600 disabled:opacity-50 text-white font-bold rounded-btn text-sm transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      {isFull ? 'Class Full' : `Enroll Now (₹${course.price})`}
                    </button>

                    <button
                      onClick={handleSaveForLater}
                      disabled={role === 'admin'}
                      className="w-full py-2.5 px-4 border border-border-ui hover:border-teal text-navy font-semibold rounded-btn text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      Save to Wishlist
                    </button>
                  </>
                )}
              </div>

              {/* Guarantees and highlights */}
              <div className="pt-2 border-t border-border-ui space-y-3 text-xs text-text-secondary">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal flex items-center justify-center flex-none">
                    <FaShieldAlt className="text-sm" />
                  </div>
                  <span><strong>100% Satisfaction Guarantee:</strong> 7-day hassle-free refund if not satisfied.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-ai-100 text-blue-ai flex items-center justify-center flex-none">
                    <FaGraduationCap className="text-sm" />
                  </div>
                  <span><strong>Verified Certification:</strong> Digital Certificate of Completion upon finishing.</span>
                </div>
              </div>

              {/* Key Course Attributes List */}
              <div className="pt-4 border-t border-border-ui">
                <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-3">Session Specifications</h4>
                <ul className="space-y-3 text-xs">
                  <li className="flex justify-between py-1 border-b border-border-ui/60">
                    <span className="text-text-secondary flex items-center gap-1.5"><FaUser className="text-teal" /> Instructor</span>
                    <span className="font-semibold text-navy">{course.instructorName || 'Yoga Master'}</span>
                  </li>
                  <li className="flex justify-between py-1 border-b border-border-ui/60">
                    <span className="text-text-secondary flex items-center gap-1.5"><FaClock className="text-teal" /> Duration</span>
                    <span className="font-semibold text-navy">60 Minutes / Class</span>
                  </li>
                  <li className="flex justify-between py-1 border-b border-border-ui/60">
                    <span className="text-text-secondary flex items-center gap-1.5"><FaAward className="text-teal" /> Difficulty</span>
                    <span className="font-semibold text-navy">{courseLevel}</span>
                  </li>
                  {course?.categories && Array.isArray(course.categories) && course.categories.filter((cat) => cat !== 'Beginner').length > 0 && (
                    <li className="flex justify-between py-1 border-b border-border-ui/60">
                      <span className="text-text-secondary flex items-center gap-1.5"><FaAward className="text-teal" /> Categories</span>
                      <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                        {course.categories.filter((cat) => cat !== 'Beginner').map((cat, i) => (
                          <span key={i} className="text-[10px] bg-teal-50 text-teal font-semibold px-2 py-0.5 rounded-full border border-teal/20">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </li>
                  )}
                  <li className="flex justify-between py-1 border-b border-border-ui/60">
                    <span className="text-text-secondary flex items-center gap-1.5"><MdLiveTv className="text-teal" /> Studio</span>
                    <span className="font-semibold text-navy">Jitsi Meet Live Room</span>
                  </li>
                  <li className="flex justify-between py-1 border-b border-border-ui/60">
                    <span className="text-text-secondary flex items-center gap-1.5"><FaUsers className="text-teal" /> Enrolled</span>
                    <span className="font-semibold text-navy">{course.totalEnrolled || 0} students</span>
                  </li>
                </ul>
              </div>

              {/* Share */}
              <div className="pt-2 border-t border-border-ui flex items-center justify-between text-xs">
                <span className="font-semibold text-text-secondary">Share this session:</span>
                <button
                  onClick={handleShare}
                  className="px-3 py-1.5 bg-surface-2 hover:bg-surface-2/80 rounded-btn text-navy font-bold flex items-center gap-1.5 transition"
                >
                  <FaShareAlt className="text-teal text-xs" /> {copiedLink ? 'Copied!' : 'Copy Link'}
                </button>
              </div>

            </div>

            {/* Related Courses Widget */}
            {relatedCourses.length > 0 && (
              <div className="bg-white rounded-card border border-border-ui p-6 shadow-sm space-y-4">
                <h4 className="font-bold text-navy text-sm sm:text-base">Explore Related Classes</h4>
                <div className="space-y-4">
                  {relatedCourses.map((rel) => (
                    <Link
                      key={rel._id}
                      to={`/class/${rel._id}`}
                      className="flex gap-3 group items-center"
                    >
                      <div className="w-16 h-16 rounded-card overflow-hidden bg-surface-2 flex-none">
                        <img
                          src={rel.image || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=300&q=80'}
                          alt={rel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-navy line-clamp-1 group-hover:text-teal transition-colors">
                          {rel.name}
                        </h5>
                        <p className="text-[11px] text-text-secondary line-clamp-1">{rel.instructorName}</p>
                        <span className="text-xs font-bold text-navy mt-1 block">
                          {rel.price === 0 ? 'Free' : `₹${rel.price}`}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default SingleClass;