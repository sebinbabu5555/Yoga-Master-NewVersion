import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: '8,400+', label: 'Active learners',    icon: '👤' },
  { value: '200+',   label: 'Classes available',  icon: '🎯' },
  { value: '40+',    label: 'Verified instructors',icon: '✅' },
  { value: '87%',    label: 'Users hit their goal',icon: '📈' },
];

const StatsSection = () => {
  return (
    <section className="py-16 bg-navy">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label, icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              className="text-center"
            >
              <p className="text-3xl mb-1">{icon}</p>
              <h3 className="text-3xl md:text-4xl font-bold text-white">{value}</h3>
              <p className="mt-1 text-sm text-white/50">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
