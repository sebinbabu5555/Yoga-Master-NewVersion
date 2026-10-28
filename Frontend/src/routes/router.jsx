import { createBrowserRouter } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import Home from "../pages/Home/Home";
import MainLayout from "../layout/MainLayout";
import Instructor from "../pages/Instructors/Instructor";
import Classes from "../pages/Classes/Classes";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import SingleClass from "../pages/Classes/SingleClass";
import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import StudentCP from "../pages/Dashboard/Student/StudentCP";
import EnrolledClasses from "../pages/Dashboard/Student/Enroll/EnrolledClasses";
import SelectedClass from "../pages/Dashboard/Student/SelectedClass";
import MyPaymentHistory from "../pages/Dashboard/Student/Payment/History/MyPaymentHistory";
import AsInstructor from "../pages/Dashboard/Student/Apply/AsInstructor";
import Payment from "../pages/Dashboard/Student/Payment/Payment";
import CourseDetails from "../pages/Dashboard/Student/Enroll/CourseDetails";
import InstructorCP from "../pages/Dashboard/Instructor/InstructorCP";
import AddClass from "../pages/Dashboard/Instructor/AddClass";
import MyClasses from "../pages/Dashboard/Instructor/MyClasses";
import PendingCourse from "../pages/Dashboard/Instructor/PendingCourse";
import ApprovedCourse from "../pages/Dashboard/Instructor/ApprovedCourse";
import AdminHome from "../pages/Dashboard/Admin/AdminHome";
import ManageClasses from "../pages/Dashboard/Admin/ManageClasses";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import UpdateUser from "../pages/Dashboard/Admin/UpdateUser";
import ManageApplications from "../pages/Dashboard/Admin/ManageApplications";
import LiveClassRoom from "../pages/Dashboard/LiveClass/LiveClassRoom";
import Onboarding from "../pages/user/Onboarding";
import Recommendations from "../pages/Dashboard/Student/Recommendations";
import PersonalTraining from "../pages/Dashboard/PersonalTraining/PersonalTraining";
import TrainingPlans from "../pages/Dashboard/Programs/TrainingPlans";
import Profile from "../pages/Dashboard/Profile/Profile";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout/>,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path:"instructors",
        element: <Instructor/>
      },
      {
        path:"classes",
        element: <Classes/>
      },
      {
          path: "/login",
          element: <Login/>
        
      },
      {
          path: "/register",
          element: <Register/>
        
      },
      {
        path: "/class/:id",
        element: <SingleClass />,
        loader: ({params}) => fetch(`${API_BASE_URL}/class/${params.id}`)
      },
      {
        path: "/onboarding",
        element: <Onboarding />
      }
    ]
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: "explore-classes",
        element: <Classes />
      },
      {
        path: "profile",
        element: <Profile />
      },
      {
        path: "personalisation",
        element: <Profile />
      },
      {
        path: "recommendations",
        element: <Recommendations />
      },
      {
        path: "personal-training",
        element: <PersonalTraining />
      },
      {
        path: "training-plan",
        element: <TrainingPlans />
      },
      {
        path: "onboarding",
        element: <Onboarding />
      },
      {
        path: "instructors",
        element: <Instructor />
      },

      //students routes
      {
        path: "student-cp",
        element: <StudentCP/>

      },

      {
        path: "enrolled-class",
        element: <EnrolledClasses/>

      },
      
      {
        path: "my-selected",
        element: <SelectedClass/>

      },

      {
        path: "my-payments",
        element: <MyPaymentHistory/>

      },

      {
        path: "apply-instructor",
        element: <AsInstructor/>

      },

      {
        path: "user/payment",
        element: <Payment/>

      },
      {
        path: "/dashboard/course-details",
        element: <CourseDetails/>

      },
      {
        path: "live-class/:id",
        element: <LiveClassRoom/>
      },

      //instructor routes 
      {
        path: "instructor-cp",
        element: <InstructorCP/>

      },
      {
        path: "add-class",
        element: <AddClass/>

      },
      {
        path: "my-classes",
        element: <MyClasses/>
      },
      {
        path: "my-pending",
        element: <PendingCourse/>
      },
      {
        path: "my-approved",
        element: <ApprovedCourse/>
      },

      //Admin routes
      {
        path: "admin-home",
        element: <AdminHome/>
      },
      {
        path: "manage-class",
        element: <ManageClasses />
      },
      {
        path: "manage-users",
        element: <ManageUsers />
      },
      {
        path: "manage-applications",
        element: <ManageApplications />
      },
      {
        path: "update-user/:id",
        element: <UpdateUser/>,
        loader: ({params}) => fetch(`${API_BASE_URL}/users/${params.id}`)
      }
    ]

  }
]);