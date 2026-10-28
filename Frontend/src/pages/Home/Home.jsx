import React from 'react'
import HeroContainer from './Hero/HeroContainer'
import Programs from './Programs/Programs'
import SmartPlanning from './SmartPlanning/SmartPlanning'
import PopularTeacher from './PopularTeacher/PopularTeacher'
import AICoachSection from './AICoach/AICoachSection'
import StatsSection from './PopularTeacher/StatsSection'

const Home = () => {
  return (
    <main>
      <HeroContainer />
      <Programs />
      <SmartPlanning />
      <PopularTeacher />
      <AICoachSection />
      <StatsSection />
    </main>
  )
}

export default Home
