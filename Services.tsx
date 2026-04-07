import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { COURSES, CATEGORIES_STRUCTURE } from '../constants';
import { ArrowLeft, ExternalLink, Filter, Star, Smartphone, Monitor } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Material } from '../types';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

export default function Services() {
  const { category, section } = useParams<{ category?: string; section?: string }>();
  const [dbMaterials, setDbMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [activeDevice, setActiveDevice] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setDbMaterials(data);
      }
      setLoading(false);
    };
    fetchMaterials();
  }, []);

  if (category) {
    const staticCourses = COURSES.filter(c => c.category === category);
    const dynamicMaterials = dbMaterials.filter(m => m.category === category);
    const allMaterials = [...dynamicMaterials, ...staticCourses];

    const categoryTitles: Record<string, string> = {
      editing: 'Material for Editing',
      software: 'Software and Apps',
      ai: 'AI Master Classes',
      others: 'Others',
    };

    const handleDownload = (e: React.MouseEvent) => {
      if (!user) {
        e.preventDefault();
        navigate('/login', { state: { from: window.location.pathname, message: 'Please login to download resources' } });
      }
    };

    const currentCategoryStructure = CATEGORIES_STRUCTURE[category as keyof typeof CATEGORIES_STRUCTURE];

    if (section) {
      const decodedSection = decodeURIComponent(section);
      let filteredMaterials = allMaterials.filter(m => 
        m.section === decodedSection || m.title === decodedSection || (category === 'software' && m.device?.toLowerCase() === decodedSection.toLowerCase())
      );

      if (activeSubcategory) {
        filteredMaterials = filteredMaterials.filter(m => m.subcategory === activeSubcategory);
      }

      const subcategories = (currentCategoryStructure?.sections?.[decodedSection]) || [];

      return (
        <div className="min-h-screen pb-24">
          <section className="px-[5%] py-16 bg-gradient-to-b from-accent/5 to-transparent">
            <div className="max-w-7xl mx-auto">
              <Link to={`/services/${category}`} className="inline-flex items-center gap-2 text-accent font-semibold mb-8 hover:gap-3 transition-all">
                <ArrowLeft size={18} /> Back to {categoryTitles[category]}
              </Link>
              <div className="text-accent text-[0.8rem] font-semibold tracking-[2px] uppercase mb-3">{categoryTitles[category]}</div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">
                {decodedSection}
              </h1>
              
              {subcategories.length > 0 && (
                <div className="mt-12">
                  <div className="flex items-center gap-2 text-sm font-bold text-muted uppercase tracking-widest mb-6">
                    <Filter size={14} /> Filter by Type
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveSubcategory(null)}
                      className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${!activeSubcategory ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-surface border border-white/5 text-muted hover:text-white'}`}
                    >
                      All
                    </button>
                    {subcategories.map((sub: string) => (
                      <button
                        key={sub}
                        onClick={() => setActiveSubcategory(sub)}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeSubcategory === sub ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-surface border border-white/5 text-muted hover:text-white'}`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          <div className="px-[5%] max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-white/5 rounded-2xl overflow-hidden shadow-xl hover:translate-y-[-4px] transition-all group"
              >
                <div className={`h-48 flex items-center justify-center text-5xl bg-gradient-to-br ${material.gradient} relative`}>
                  {material.logo_url ? (
                    <img src={material.logo_url} alt={material.title} className="w-20 h-20 object-contain drop-shadow-2xl" referrerPolicy="no-referrer" />
                  ) : material.thumbnail_url ? (
                    <img src={material.thumbnail_url} alt={material.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    material.thumbnail_icon || '📦'
                  )}
                  {material.rating && (
                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-accent">
                      <Star size={12} fill="currentColor" /> {material.rating}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold">{material.title}</h3>
                    {material.device && (
                      <span className="text-muted">
                        {material.device === 'mobile' ? <Smartphone size={16} /> : <Monitor size={16} />}
                      </span>
                    )}
                  </div>
                  <p className="text-muted text-sm mb-6 line-clamp-2">{material.description}</p>
                  
                  {material.screenshots && material.screenshots.length > 0 && (
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                      {material.screenshots.map((s, i) => (
                        <img key={i} src={s} alt="Screenshot" className="h-20 w-auto rounded-lg border border-white/5 flex-shrink-0" referrerPolicy="no-referrer" />
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="bg-accent-3/10 text-accent-3 border border-accent-3/30 rounded-full px-3 py-1 text-[0.76rem] font-bold">
                      {material.is_free ? 'FREE' : 'PREMIUM'}
                    </span>
                    <a 
                      href={material.resource_url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={handleDownload}
                      className="bg-background-grad text-white px-5 py-2 rounded-full text-sm font-bold font-display hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      {category === 'software' ? 'Download' : 'Access Now'} <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredMaterials.length === 0 && !loading && (
              <div className="col-span-full text-center py-20">
                <p className="text-muted">No resources found in this section yet.</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    // If we are in a category but no section is selected
    let sections: string[] = [];
    if (category === 'software') {
      sections = CATEGORIES_STRUCTURE.software.devices;
    } else {
      sections = Object.keys(currentCategoryStructure?.sections || {});
    }

    return (
      <div className="min-h-screen pb-24">
        <section className="px-[5%] py-16 bg-gradient-to-b from-accent/5 to-transparent">
          <div className="max-w-7xl mx-auto">
            <Link to="/services" className="inline-flex items-center gap-2 text-accent font-semibold mb-8 hover:gap-3 transition-all">
              <ArrowLeft size={18} /> Back to Services
            </Link>
            <div className="text-accent text-[0.8rem] font-semibold tracking-[2px] uppercase mb-3">Category</div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">
              {categoryTitles[category] || 'Resources'}
            </h1>
            <p className="text-muted text-lg max-w-[560px]">
              Select a {category === 'software' ? 'device' : 'section'} to explore premium {categoryTitles[category]} resources.
            </p>
          </div>
        </section>

        <div className="px-[5%] max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((sec, i) => {
            // Find a representative material for the gradient/icon
            const rep = allMaterials.find(m => m.section === sec || m.title === sec || m.device?.toLowerCase() === sec.toLowerCase()) || allMaterials[0];
            return (
              <Link
                key={sec}
                to={`/services/${category}/${encodeURIComponent(sec)}`}
                className="bg-card border border-white/5 rounded-3xl p-8 hover:border-accent/30 transition-all group relative overflow-hidden"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 bg-gradient-to-br ${rep?.gradient || 'from-accent to-accent-3'} overflow-hidden`}>
                  {category === 'software' ? (
                    sec === 'Mobile' ? <Smartphone size={32} /> : <Monitor size={32} />
                  ) : rep?.thumbnail_url ? (
                    <img src={rep.thumbnail_url} alt={sec} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    rep?.thumbnail_icon || '📁'
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">{sec}</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Explore all {sec} {category === 'software' ? 'applications and tools' : 'materials and assets'}.
                </p>
                <div className="mt-6 flex items-center gap-2 text-accent text-sm font-bold opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                  View {category === 'software' ? 'Apps' : 'Section'} <ExternalLink size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <section className="px-[5%] py-20 bg-gradient-to-b from-accent/5 to-transparent text-center">
        <div className="text-accent text-[0.8rem] font-semibold tracking-[2px] uppercase mb-3">Our Services</div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">
          All <span className="text-grad">Free Resources</span>
        </h1>
        <p className="text-muted text-lg max-w-[560px] mx-auto">
          Choose your category and start accessing premium content absolutely free.
        </p>
      </section>

      <div className="px-[5%] max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <ServiceCard
          icon="🎬"
          title="Material for Editing"
          description="VFX, Sfx, Icons, Pngs, Stock images, stock videos, and luts — all premium assets for free."
          category="editing"
          iconBg="bg-[#ff6b6b]/10"
        />
        <ServiceCard
          icon="💻"
          title="Software & Apps"
          description="Hundreds of premium PC software, laptop tools, and mobile apps for Android & iOS — all free."
          category="software"
          iconBg="bg-[#6c63ff]/10"
        />
        <ServiceCard
          icon="🤖"
          title="AI Masterclasses"
          description="Master ChatGPT, Midjourney, Gemini, Stable Diffusion, Runway ML and more cutting-edge AI tools."
          category="ai"
          iconBg="bg-[#43e8d8]/10"
        />
        <ServiceCard
          icon="✨"
          title="Others & More"
          description="Freelancing, coding, digital marketing, web design, productivity tools and much more."
          category="others"
          iconBg="bg-[#f5c842]/10"
        />
      </div>
    </div>
  );
}
