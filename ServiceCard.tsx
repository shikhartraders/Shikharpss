import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  category: string;
  iconBg: string;
  delay?: number;
}

export default function ServiceCard({ icon, title, description, category, iconBg, delay = 0 }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
      className="group relative bg-card border border-white/5 rounded-[20px] p-8 transition-all duration-300 hover:translate-y-[-6px] hover:border-accent/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden cursor-pointer"
    >
      <div className="absolute inset-0 bg-background-grad opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-[20px]" />
      
      <div className={cn("w-[54px] h-[54px] rounded-[14px] flex items-center justify-center text-2xl mb-5 relative z-10", iconBg)}>
        {icon}
      </div>
      
      <h3 className="text-[1.15rem] font-bold mb-2.5 relative z-10">{title}</h3>
      <p className="text-muted text-[0.9rem] leading-relaxed mb-4 relative z-10">{description}</p>
      
      <span className="inline-block bg-accent-3/10 text-accent-3 border border-accent-3/25 rounded-full px-3 py-1 text-[0.76rem] font-semibold relative z-10">
        FREE ACCESS
      </span>
      
      <div className="absolute bottom-6 right-6 w-9 h-9 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-base transition-all duration-300 group-hover:bg-accent group-hover:border-accent group-hover:rotate-45 z-10">
        <ArrowUpRight size={18} />
      </div>

      <Link to={`/services/${category}`} className="absolute inset-0 z-20" />
    </motion.div>
  );
}
