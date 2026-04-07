import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5 py-16 px-[5%]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <Link to="/" className="font-display font-extrabold text-xl tracking-tighter inline-block">
            <span className="text-grad">Shikhar</span>
            <span className="text-accent-2">PS</span>
          </Link>
          <p className="text-muted text-sm leading-relaxed max-w-[280px]">
            100% free learning platform for software, AI, editing, and more. Powered by Shikhar Pandey.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold tracking-wider uppercase">Services</h4>
          <div className="flex flex-col gap-2">
            <Link to="/services/editing" className="text-muted text-[0.86rem] hover:text-accent transition-colors">Editing Materials</Link>
            <Link to="/services/software" className="text-muted text-[0.86rem] hover:text-accent transition-colors">Software & Apps</Link>
            <Link to="/services/ai" className="text-muted text-[0.86rem] hover:text-accent transition-colors">AI Masterclasses</Link>
            <Link to="/services/others" className="text-muted text-[0.86rem] hover:text-accent transition-colors">Others</Link>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold tracking-wider uppercase">Company</h4>
          <div className="flex flex-col gap-2">
            <Link to="/about" className="text-muted text-[0.86rem] hover:text-accent transition-colors">About Us</Link>
            <Link to="/contact" className="text-muted text-[0.86rem] hover:text-accent transition-colors">Contact</Link>
            <Link to="/privacy" className="text-muted text-[0.86rem] hover:text-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-muted text-[0.86rem] hover:text-accent transition-colors">Terms of Use</Link>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold tracking-wider uppercase">Contact</h4>
          <div className="flex flex-col gap-2">
            <span className="text-muted text-[0.86rem]">noreply@shikharps.in</span>
            <span className="text-muted text-[0.86rem]">+1 575 900 2417</span>
            <Link to="/contact" className="text-muted text-[0.86rem] hover:text-accent transition-colors">Send Feedback</Link>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-muted text-[0.82rem]">
          © 2025 Shikhar PS · Powered by Shikhar Pandey · All Resources Free
        </p>
        <p className="text-accent text-[0.82rem] font-medium">
          Made with ❤️ for Learners
        </p>
      </div>
    </footer>
  );
}
