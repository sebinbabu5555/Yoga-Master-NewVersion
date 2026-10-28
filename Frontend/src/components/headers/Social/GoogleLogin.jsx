import { FcGoogle } from "react-icons/fc";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getOnboardingDraft, syncOnboardingDraft } from "../../../ultilities/onboardingSync";
import { API_BASE_URL } from "../../../config/api";


const GoogleLogin = () => {
    const {googleLogin} = useAuth()
    const navigate = useNavigate()
    const handleLogin = () =>{
        googleLogin().then(async (userCredential) => {
            const user = userCredential.user;
            if(user){
                const userImp = {
                    name: user?.displayName,
                    email: user?.email,
                    photoURL: user?.photoURL,
                    role: 'user',
                    gender: "Is not specified",
                    address: "is not specified",
                    phone: "is not specified",
                };
                
                if(user.email && user.displayName){
                    try {
                        await axios.post(`${API_BASE_URL}/new-user`, userImp);
                    } catch (e) {
                        // User might already exist in MongoDB
                    }

                    // Obtain token
                    let token = localStorage.getItem('token');
                    try {
                        const tokenRes = await axios.post(`${API_BASE_URL}/api/set-token`, {
                            email: user.email,
                            name: user.displayName
                        });
                        token = tokenRes.data?.token;
                        if (token) localStorage.setItem('token', token);
                    } catch (e) {}

                    const draft = getOnboardingDraft();
                    if (draft && token) {
                        await syncOnboardingDraft(token);
                        navigate('/dashboard/recommendations');
                    } else {
                        navigate('/dashboard');
                    }
                }
            }
            
        }).catch((error) => {
            // Handle Errors here.
            const errorCode  = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            console.log(errorMessage)
            
          });
    };
  return (
    <div className="flex items-center justify-center my-3">
        <button onClick={() =>{handleLogin()}} className="flex items-center px-6 py-4 text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-lg shadow-md outline-none hover:bg-gray-200 focus:outline-none">
        <FcGoogle className="w-6 h-6 mr-2" />
            <span>Continue with google</span>
        </button>
    </div>
  )
}

export default GoogleLogin