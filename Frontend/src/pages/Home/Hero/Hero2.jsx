import React from 'react'
import bgImg from '../../../assets/home/banner-2.jpg'
const Hero2 = () => {
  return (
    <div className='min-h-screen bg-cover' style={{backgroundImage: `url(${bgImg})`}}>
        <div className='flex items-center justify-start min-h-screen text-white bg-black pl-11 bg-opacity-60'>
            <div>
                <div className='space-y-4'>
                   <p className='text-2xl md:text-4xl'>Best Online</p>
                   <h1 className='text-4xl font-bold md:text-7xl'>Courses From Home</h1>
                   <div className='md:w-1/2'>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
                        Maxime voluptatem quidem commodi quibusdam molestiae animi, necessitatibus possimus dicta ad dolores. 
                        Nostrum itaque dignissimos modi aliquam illo nam iste incidunt provident.</p>
                   </div>
                   <div className='flex flex-wrap items-center gap-5'>
                    <button className='py-3 font-bold uppercase rounded-lg px-7 bg-secondary'>Join Today</button>
                    <button className='py-3 font-bold uppercase border rounded-lg px-7 hover:bg-secondary'>View Course</button>
                   </div>
                </div>
            </div>
        </div>

    </div>
  )
}

export default Hero2


