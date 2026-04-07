import React, { useState } from 'react';
import { Mail, Phone, User, Clock, Send } from 'lucide-react';
import { motion } from 'motion/react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen pb-24">
      <section className="px-[5%] py-20 bg-gradient-to-b from-accent/5 to-transparent text-center">
        <div className="text-accent text-[0.8rem] font-semibold tracking-[2px] uppercase mb-3">Get In Touch</div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">
          We'd Love to <span className="text-grad">Hear From You</span>
        </h1>
        <p className="text-muted text-lg max-w-[560px] mx-auto">
          Got a question, feedback, or want to collaborate? Drop us a message and we'll get back to you.
        </p>
      </section>

      <div className="px-[5%] max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16 py-12">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold tracking-tighter">Contact <span className="text-grad">Shikhar PS</span></h2>
            <p className="text-muted leading-relaxed">
              Have feedback about our courses? Found a broken link? Want to suggest new content? We read every message and respond to all genuine inquiries.
            </p>
          </div>

          <div className="space-y-6">
            {[
              { icon: <Mail size={20} />, label: 'Email Us', value: 'noreply@shikharps.in' },
              { icon: <Phone size={20} />, label: 'Call Us', value: '+1 575 900 2417' },
              { icon: <User size={20} />, label: 'Founder', value: 'Piyush Pandey' },
              { icon: <Clock size={20} />, label: 'Response Time', value: 'Within 24-48 hours' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="text-[0.75rem] text-muted font-bold uppercase tracking-wider">{item.label}</div>
                  <div className="text-[0.95rem] font-medium mt-0.5">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-white/5 rounded-[32px] p-8 md:p-10 shadow-2xl">
          <h3 className="text-xl font-bold mb-6">Send Us a Message 💬</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">First Name</label>
                <input type="text" required className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-text focus:border-accent outline-none transition-all" placeholder="First Name" />
              </div>
              <div className="space-y-2">
                <label className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">Last Name</label>
                <input type="text" required className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-text focus:border-accent outline-none transition-all" placeholder="Last Name" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">Email Address</label>
              <input type="email" required className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-text focus:border-accent outline-none transition-all" placeholder="your@email.com" />
            </div>

            <div className="space-y-2">
              <label className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">Subject</label>
              <select className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-text focus:border-accent outline-none transition-all appearance-none">
                <option>General Inquiry</option>
                <option>Course Feedback</option>
                <option>Broken Link / Issue</option>
                <option>Content Request</option>
                <option>Collaboration</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[0.82rem] font-semibold text-muted uppercase tracking-wider">Your Message</label>
              <textarea required className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-text focus:border-accent outline-none transition-all min-h-[120px]" placeholder="Write your message here..." />
            </div>

            <button type="submit" className="w-full bg-background-grad text-white py-4 rounded-xl font-bold font-display tracking-wide hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              Send Message <Send size={18} />
            </button>

            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-accent-3/10 border border-accent-3/20 text-accent-3 px-4 py-3 rounded-xl text-sm text-center"
              >
                ✅ Thank you! Your message has been sent.
              </motion.div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
