import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const programs = [
  { label: 'Beginner Foundations', icon: '🟢', desc: 'Start with the basics. No experience needed.', color: 'bg-teal-100', accent: 'text-teal' },
  { label: 'Flexibility',          icon: '🤸', desc: 'Improve range of motion and joint health.', color: 'bg-blue-ai-100', accent: 'text-blue-ai' },
  { label: 'Strength & Mobility',  icon: '💪', desc: 'Build functional strength with every session.', color: 'bg-coral-100', accent: 'text-coral' },
  { label: 'Posture Correction',   icon: '🎯', desc: 'Fix desk posture and reduce back pain.', color: 'bg-surface-2', accent: 'text-navy' },
  { label: 'Weight Management',    icon: '⚡', desc: 'Active calorie-burning yoga flows.', color: 'bg-coral-100', accent: 'text-coral' },
  { label: 'Recovery',             icon: '🔄', desc: 'Rest-day sessions to aid muscle recovery.', color: 'bg-teal-100', accent: 'text-teal' },
  { label: 'Stress Management',    icon: '🧘', desc: 'Breathing and movement to reset your nervous system.', color: 'bg-blue-ai-100', accent: 'text-blue-ai' },
  { label: 'Advanced Practice',    icon: '🏆', desc: 'Challenge your limits with complex flows.', color: 'bg-surface-2', accent: 'text-navy' },
]

const Programs = () => {
  const navigate = useNavigate()

  return (
    <section className="py-20 bg-bg-base">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-teal mb-2">Goal-Oriented Programs</p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy leading-tight">
              Find a program that fits your goal
            </h2>
          </div>
          <button
            onClick={() => navigate('/classes')}
            className="text-sm font-bold text-teal hover:text-teal-600 flex-shrink-0 flex items-center gap-1 transition-colors"
          >
            Browse all programs →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {programs.map((prog, i) => (
            <motion.button
              key={prog.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              onClick={() => navigate('/classes')}
              className="text-left p-5 rounded-card bg-white border border-border-ui hover:border-teal/40 hover:shadow-md transition-all duration-200 group"
            >
              <div className={`w-10 h-10 rounded-lg ${prog.color} flex items-center justify-center text-xl mb-3`}>
                {prog.icon}
              </div>
              <p className={`text-sm font-bold ${prog.accent} mb-1 group-hover:text-teal transition-colors`}>{prog.label}</p>
              <p className="text-xs text-text-secondary leading-snug">{prog.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Programs
