import React, { useEffect, useState } from 'react'
import useUser from '../../../hooks/useUser'
import { useNavigate, Link } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import moment from 'moment';
import { MdDeleteSweep } from 'react-icons/md';
import { FiDollarSign } from 'react-icons/fi';
import { HashLoader } from 'react-spinners';
import Swal from 'sweetalert2';

const SelectedClass = () => {
    const {currentUser} = useUser();
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState([]);
    const [page, setPage] = useState(1);
    const itemPerPage = 5;
    const totalPage = Math.ceil(classes.length / itemPerPage);
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        if (currentUser?.email) {
            axiosSecure
            .get(`/cart/${currentUser.email}`)
            .then((res) => {
                setClasses(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [currentUser?.email]);
    
    const totalPrice = classes.reduce((acc, item) => acc + parseInt(item.price), 0);
    const totalTax = totalPage * 0.01;
    const price = totalPrice + totalTax;
    
    const handlePay = (id) => {
        // console.log(id);
        const item  = classes.find((item) => item._id === id);
        const price = item.price;
        // console.log(price);
        navigate('/dashboard/user/payment', { state: { price: price, itemId: id } })
    }
    
    const handleDelete = (id) => {
        // console.log(id)
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/delete-cart-items/${id}`).then((res) => {
                    if(res.data.deletedCount > 0) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                          }); 
                          
                          const newClasses = classes.filter((item) => item._id !== id);
                          setClasses(newClasses);
                    }
                    
                }).catch((error) => console.log(error))
              
            }
          });
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <HashLoader color="#12B8A6" size={40} />
                <p className="text-sm font-semibold text-text-secondary mt-3">Loading saved classes...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-navy">
                    Saved <span className="text-teal">Classes</span>
                </h1>
                <p className="text-sm text-text-secondary mt-1">
                    Review your shortlisted training sessions before enrolling.
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Classes Table */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-card border border-border-ui overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-bg-base text-xs text-text-secondary uppercase tracking-wide border-b border-border-ui">
                                        <th className="px-5 py-3 text-left font-semibold">#</th>
                                        <th className="px-5 py-3 text-left font-semibold">Class</th>
                                        <th className="px-5 py-3 text-left font-semibold">Price</th>
                                        <th className="px-5 py-3 text-left font-semibold">Added</th>
                                        <th className="px-5 py-3 text-right font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                
                                <tbody className="divide-y divide-border-ui">
                                    {classes.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="py-12 text-center">
                                                <p className="text-base font-semibold text-text-primary mb-1">No Saved Classes</p>
                                                <p className="text-xs text-text-secondary mb-4">You haven't saved any classes to your list yet.</p>
                                                <Link
                                                    to="/dashboard/explore-classes"
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal text-white text-xs font-semibold rounded-btn hover:bg-teal-600 transition-colors shadow-sm"
                                                >
                                                    Explore Classes
                                                </Link>
                                            </td>
                                        </tr>
                                    ) : (
                                        classes.map((item, idx) => {
                                            const letIdx = (page - 1) * itemPerPage + idx + 1; 
                                            return (
                                                <tr key={item._id} className="hover:bg-bg-base/60 transition-colors">
                                                    <td className="px-5 py-4 font-semibold text-text-secondary text-xs">{letIdx}</td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <img src={item.image} alt={item.name} className="w-14 h-12 object-cover rounded-lg border border-border-ui" />
                                                            <div>
                                                                <p className="font-bold text-navy text-sm leading-tight">{item.name}</p>
                                                                <p className="text-xs text-text-secondary mt-0.5">{item.instructorName || 'Instructor'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 font-bold text-navy">₹{item.price}</td>
                                                    <td className="px-5 py-4 text-xs text-text-secondary">
                                                        {moment(item.submitted || item.date).format("MMM DD, YYYY")}
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <div className="inline-flex items-center gap-2">
                                                            <button
                                                                onClick={() => handlePay(item._id)}
                                                                className="px-3 py-1.5 bg-teal hover:bg-teal-600 text-white font-bold text-xs rounded-btn transition-colors shadow-xs"
                                                            >
                                                                Enroll
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(item._id)}
                                                                className="p-1.5 text-error hover:bg-red-50 border border-error/30 hover:border-error rounded-btn transition-colors"
                                                                title="Remove class"
                                                            >
                                                                <MdDeleteSweep className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                {/* Right: Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-card border border-border-ui p-6 shadow-sm sticky top-6 space-y-4">
                        <h2 className="text-base font-bold text-navy pb-3 border-b border-border-ui">Order Summary</h2>
                        <div className="space-y-2.5 text-xs text-text-secondary">
                            <div className="flex justify-between">
                                <span>Subtotal ({classes.length} {classes.length === 1 ? 'class' : 'classes'})</span>
                                <span className="font-bold text-text-primary">₹{totalPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Platform & Tax</span>
                                <span className="font-bold text-text-primary">₹{totalTax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Processing Fee</span>
                                <span className="text-teal font-semibold">Free</span>
                            </div>
                        </div>
                        
                        <div className="pt-3 border-t border-border-ui flex justify-between items-center">
                            <span className="font-bold text-navy text-sm">Total Due</span>
                            <span className="font-bold text-navy text-lg">₹{price.toFixed(2)}</span>
                        </div>
                        
                        <button
                            disabled={price <= 0 || classes.length === 0}
                            onClick={() => navigate('/dashboard/user/payment', { state: { price: price, itemId: null } })}
                            className="w-full py-2.5 bg-teal hover:bg-teal-600 disabled:opacity-50 text-white font-bold text-xs rounded-btn transition-colors shadow-sm cursor-pointer"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectedClass;