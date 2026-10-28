import React from 'react'
import useUser from '../../hooks/useUser'
import {HashLoader} from 'react-spinners'
import DashboardNavigate from '../../routes/DashboardNavigate';

const Dashboard = () => {

  const {currentUser, isLoading} = useUser();
  const role = currentUser?.role;

  if(isLoading){
    return <div className='flex items-center justify-center h-screen'>
      <HashLoader color="#FF1949" size={50} />
      </div>
  }


  return (
    <DashboardNavigate />
  )
}

export default Dashboard