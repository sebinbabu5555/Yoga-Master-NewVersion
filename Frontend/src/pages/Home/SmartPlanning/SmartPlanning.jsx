import React from 'react'
import { motion } from 'framer-motion'

const schedule = [
  { day: 'MON', activity: '20 min Mobility',        done: true },
  { day: 'TUE', activity: 'Rest',                   done: true,  rest: true },
  { day: 'WED', activity: '35 min Strength Flow',   done: true },
  { day: 'THU', activity: '15 min Recovery',        done: false },
  { day: 'FRI', activity: 'Private session · 6:30 PM', done: false, appointment: true },
  { day: 'SAT', activity: '30 min Core & Balance',  done: false },
  { day: 'SUN', activity: 'Rest',                   done: false, rest: true },
]

const SmartPlanning = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-teal mb-2">Smart Planning</p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy leading-tight mb-4">
              Build a routine that actually fits your week
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              Tell us when you're available and what you're working on. Yoga Master schedules sessions around your calendar, adapts when life gets busy, and keeps you on track without the stress.
            </p>
            <ul className="space-y-3">
              {[
                'Adapts to your schedule automatically',
                'Mixes classes, rest days, and private sessions',
                'Adjusts when you miss a day',
                'Weekly goal tracking built in',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-text-primary">
                  <span className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#12B8A6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right: Weekly calendar preview */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-bg-base rounded-card border border-border-ui p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-navy">This Week · Sep 22 – 28</h3>
              <span className="text-xs font-bold px-2.5 py-1 bg-teal-100 text-teal rounded-full">3 / 5 sessions done</span>
            </div>
            <div className="space-y-2">
              {schedule.map(({ day, activity, done, rest, appointment }) => (
                <div
                  key={day}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    done
                      ? 'bg-white border-border-ui opacity-60'
                      : appointment
                      ? 'bg-blue-ai-100 border-blue-ai/30'
                      : rest
                      ? 'bg-surface-2 border-border-ui'
                      : 'bg-white border-border-ui'
                  }`}
                >
                  <span className={`text-xs font-bold w-8 flex-shrink-0 ${done ? 'text-text-secondary' : 'text-navy'}`}>{day}</span>
                  {done && !rest && (
                    <svg className="w-4 h-4 text-teal flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  )}
                  {appointment && (
                    <svg className="w-4 h-4 text-blue-ai flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v8H4V8z" clipRule="evenodd"/>
                    </svg>
                  )}
                  {rest && !done && (
                    <span className="w-4 h-4 flex-shrink-0"></span>
                  )}
                  <span className={`text-sm font-medium flex-1 ${done ? 'line-through text-text-secondary' : appointment ? 'text-blue-ai font-semibold' : 'text-text-primary'}`}>
                    {activity}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default SmartPlanning
