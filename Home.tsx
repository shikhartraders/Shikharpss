import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { TESTIMONIALS, COURSES } from '../constants';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Material } from '../types';
import { ExternalLink, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const [newMaterials, setNewMaterials] = useState<Material[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewMaterials = async () => {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (!error && data) {
        setNewMaterials(data);
      }
    };
    fetchNewMaterials();
  }, []);

  const handleDownload = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      navigate('/login', { state: { from: window.location.pathname, message: 'Please login to download resources' } });
    }
  };

  return (
    <div className="overflow-hidden">
      <Hero />

      {/* Marquee */}
      <div className="overflow-hidden border-y border-white/5 bg-surface py-5">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="flex gap-12 whitespace-nowrap"
        >
          {Array(20).fill([
            'Editing Courses', 'Free Software', 'AI Masterclass', 'Mobile Apps', 'PC Tools', 'Video Editing', 'Photo Editing', 'Laptop Software', 'Free Forever', 'Premium Content'
          ]).flat().map((item, i) => (
            <span key={i} className="text-muted text-[0.88rem] font-medium flex items-center gap-2.5">
              <span className="text-accent text-[0.7rem]">✦</span>
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Newest Materials Section */}
      {newMaterials.length > 0 && (
        <section className="px-[5%] py-24 bg-gradient-to-b from-accent/5 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="text-accent text-[0.8rem] font-semibold tracking-[2px] uppercase mb-3 flex items-center gap-2">
                  <Sparkles size={14} /> Just Added
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter">
                  Newest <span className="text-grad">Resources</span>
                </h2>
              </div>
              <Link to="/services" className="text-accent font-bold hover:underline hidden md:block">
                View All Resources →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newMaterials.map((material, i) => (
                <motion.div
                  key={material.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-white/5 rounded-2xl overflow-hidden shadow-xl hover:translate-y-[-4px] transition-all group"
                >
                  <div className={`h-40 flex items-center justify-center text-5xl bg-gradient-to-br ${material.gradient} overflow-hidden relative`}>
                    {material.logo_url ? (
                      <img src={material.logo_url} alt={material.title} className="w-16 h-16 object-contain drop-shadow-2xl" referrerPolicy="no-referrer" />
                    ) : material.thumbnail_url ? (
                      <img src={material.thumbnail_url} alt={material.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      material.thumbnail_icon || '📦'
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2">{material.title}</h3>
                    <p className="text-muted text-sm mb-6 line-clamp-2">{material.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="bg-accent-3/10 text-accent-3 border border-accent-3/30 rounded-full px-3 py-1 text-[0.76rem] font-bold uppercase">
                        {material.category}
                      </span>
                      <a 
                        href={material.resource_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={handleDownload}
                        className="text-accent text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Access <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Overview */}
      <section className="px-[5%] py-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <div className="text-accent text-[0.8rem] font-semibold tracking-[2px] uppercase mb-3">What We Offer</div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-4">
              Everything You Need — <span className="text-grad">Zero Cost</span>
            </h2>
            <p className="text-muted text-lg max-w-[520px]">
              From editing masterclasses to AI tools, we've got every category covered for free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard
              icon="🎬"
              title="Material for Editing"
              description="VFX, Sfx, Icons, Pngs, Stock images, stock videos, and luts — all premium assets for free."
              category="editing"
              iconBg="bg-[#ff6b6b]/10"
              delay={0}
            />
            <ServiceCard
              icon="💻"
              title="Software & Apps"
              description="Hundreds of premium software and mobile apps for PC, laptop, and phone — downloaded legally for free."
              category="software"
              iconBg="bg-[#6c63ff]/10"
              delay={0.1}
            />
            <ServiceCard
              icon="🤖"
              title="AI Masterclasses"
              description="Learn ChatGPT, Midjourney, Stable Diffusion, Gemini, and more cutting-edge AI tools with expert guidance."
              category="ai"
              iconBg="bg-[#43e8d8]/10"
              delay={0.2}
            />
            <ServiceCard
              icon="✨"
              title="Others & More"
              description="Freelancing, web design, productivity hacks, digital marketing, coding — new courses added weekly."
              category="others"
              iconBg="bg-[#f5c842]/10"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="bg-surface px-[5%] py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-accent text-[0.8rem] font-semibold tracking-[2px] uppercase mb-3">Why Shikhar PS?</div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-4">
              Built for <span className="text-grad">Real Learners</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🆓', title: 'Always Free', text: 'No subscriptions, no paywalls, no credit cards. Everything on Shikhar PS is permanently free.' },
              { icon: '📱', title: 'All Platforms', text: 'Resources work on PC, laptop, Android, and iOS. Learn anywhere, anytime, on any device.' },
              { icon: '🔄', title: 'Weekly Updates', text: 'New software, apps, courses, and AI tools are added every week so you\'re always up to date.' },
              { icon: '🏆', title: 'Premium Quality', text: 'Curated by experts. Only the best tools and courses make it to Shikhar PS.' },
              { icon: '🌐', title: 'Global Community', text: '50,000+ learners worldwide trust Shikhar PS for their digital education journey.' },
              { icon: '🔒', title: 'Safe & Trusted', text: 'All software is vetted and safe. We never distribute malware or pirated content.' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-white/5 rounded-2xl p-8 text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-muted text-[0.88rem] leading-relaxed">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-[5%] py-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <div className="text-accent text-[0.8rem] font-semibold tracking-[2px] uppercase mb-3">Testimonials</div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-4">
              What Our <span className="text-grad">Learners Say</span>
            </h2>
            <p className="text-muted text-lg max-w-[520px]">
              Thousands of students have transformed their skills with Shikhar PS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-white/5 rounded-2xl p-8 transition-transform hover:translate-y-[-4px]"
              >
                <div className="text-gold text-lg tracking-[2px] mb-3">{'★'.repeat(t.stars)}</div>
                <p className="text-muted text-[0.92rem] leading-relaxed italic mb-5">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br ${t.gradient}`}>
                    {t.avatar_text}
                  </div>
                  <div>
                    <div className="text-[0.9rem] font-semibold">{t.name}</div>
                    <div className="text-[0.78rem] text-muted">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-[5%] pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-accent/20 to-accent-3/15 border border-accent/25 rounded-[32px] p-12 md:p-20 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-4">
              Start Learning <span className="text-grad">Today — It's Free</span>
            </h2>
            <p className="text-muted text-lg mb-10 max-w-[600px] mx-auto">
              Join 50,000+ learners already using Shikhar PS to build their skills and future.
            </p>
            <Link
              to="/signup"
              className="inline-block bg-background-grad text-white px-10 py-4 rounded-full text-lg font-bold font-display tracking-wide hover:opacity-90 transition-opacity"
            >
              Get Free Access Now →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
