import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-68px)] flex items-center justify-center text-center px-[5%] py-16 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(108,99,255,0.22)_0%,transparent_70%)]" />
      <motion.div
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-accent/15 blur-[80px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
        className="absolute bottom-[-80px] right-[-80px] w-[350px] h-[350px] bg-accent-3/10 blur-[80px] rounded-full pointer-events-none"
      />

      <div className="relative z-10 max-w-[780px]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-accent/15 border border-accent/30 text-[#b3afff] px-4 py-1.5 rounded-full text-[0.82rem] font-medium mb-8"
        >
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
          100% Free · No Hidden Charges
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tighter mb-6"
        >
          Learn, Create & <span className="text-grad">Grow for Free</span> with <span className="text-accent-2">Shikhar PS</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-lg text-muted max-w-[560px] mx-auto mb-10 font-light"
        >
          Access premium courses on editing, software, AI masterclasses, and hundreds of free apps for PC, mobile & laptop — absolutely free.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link
            to="/services"
            className="bg-background-grad text-white px-9 py-3.5 rounded-full text-base font-bold font-display tracking-wide hover:translate-y-[-3px] hover:shadow-[0_12px_40px_rgba(108,99,255,0.4)] transition-all"
          >
            Explore Courses ↗
          </Link>
          <Link
            to="/about"
            className="border-1.5 border-white/10 text-text px-9 py-3.5 rounded-full text-base font-semibold font-display hover:border-accent hover:text-accent hover:translate-y-[-3px] transition-all"
          >
            Who Are We?
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="flex flex-wrap justify-center gap-10 mt-16"
        >
          {[
            { label: 'Free Resources', value: '500+' },
            { label: 'Learners', value: '50K+' },
            { label: 'Average Rating', value: '4.9★' },
            { label: 'Always Free', value: '100%' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold text-grad">{stat.value}</div>
              <div className="text-[0.82rem] text-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
