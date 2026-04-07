import { motion } from 'motion/react';

export default function About() {
  return (
    <div className="min-h-screen pb-24">
      <section className="px-[5%] py-20 bg-gradient-to-b from-accent/5 to-transparent text-center">
        <div className="text-accent text-[0.8rem] font-semibold tracking-[2px] uppercase mb-3">About Us</div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">
          The Story Behind <span className="text-grad">Shikhar PS</span>
        </h1>
        <p className="text-muted text-lg max-w-[560px] mx-auto">
          We believe quality education should have no price tag. Meet the person making that happen.
        </p>
      </section>

      <div className="px-[5%] max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-12">
        <div className="relative">
          <div className="aspect-square rounded-[32px] bg-background-grad flex items-center justify-center text-[8rem] font-extrabold text-white/20 relative overflow-hidden">
            <span className="relative z-10">PP</span>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent_60%)]" />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="absolute -bottom-6 -right-6 bg-card border border-white/10 rounded-2xl p-6 shadow-2xl flex items-center gap-4"
          >
            <div>
              <div className="text-2xl font-extrabold text-grad">50K+</div>
              <div className="text-[0.78rem] text-muted">Happy Learners</div>
            </div>
            <div className="text-3xl">🎓</div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <div className="text-accent text-[0.8rem] font-semibold tracking-[2px] uppercase">Founder & Creator</div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter">
            Piyush Pandey — The Mind Behind <span className="text-grad">Shikhar PS</span>
          </h2>
          <p className="text-muted leading-relaxed">
            Shikhar PS was founded with one powerful belief: <strong>nobody should be left behind because they can't afford education.</strong> In a world where quality courses cost hundreds of dollars, Shikhar PS breaks down every barrier.
          </p>
          <p className="text-muted leading-relaxed">
            Piyush started this platform after realizing how many talented people couldn't access the tools and knowledge they needed to grow. From editing to AI, from software to freelancing — Shikhar PS curates the best and delivers it free of cost.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
            {[
              { label: 'Free Resources', value: '500+' },
              { label: 'Learners Globally', value: '50K+' },
              { label: 'Average Rating', value: '4.9★' },
              { label: 'Serving Learners', value: '3yrs' },
            ].map((item) => (
              <div key={item.label} className="bg-card border border-white/5 rounded-xl p-4 text-center">
                <div className="text-xl font-extrabold text-grad">{item.value}</div>
                <div className="text-[0.78rem] text-muted">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
