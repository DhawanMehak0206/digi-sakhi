import { Link } from "react-router-dom";
import Logo from "./Logo";
import VisitorCounter from "./VisitorCounter";
import { Mail, Twitter, Linkedin, Instagram, Github, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-20">
      <div className="container-page py-14 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="mb-4"><Logo size="footer" /></div>
          <p className="text-sm text-muted-foreground max-w-sm">
            DigiSakhi — digital literacy, AI basics, and practical tech education built for women
            across India. Short videos, workshops, and blogs that meet learners where they are.
          </p>
          <div className="mt-4">
            <VisitorCounter />
          </div>
          <div className="mt-5 flex gap-2">
            <a href="#" aria-label="Twitter" className="p-2 border border-border hover:border-accent hover:text-accent transition-colors"><Twitter className="h-4 w-4" /></a>
            <a href="#" aria-label="LinkedIn" className="p-2 border border-border hover:border-accent hover:text-accent transition-colors"><Linkedin className="h-4 w-4" /></a>
            <a href="#" aria-label="Instagram" className="p-2 border border-border hover:border-accent hover:text-accent transition-colors"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="GitHub" className="p-2 border border-border hover:border-accent hover:text-accent transition-colors"><Github className="h-4 w-4" /></a>
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-accent">Home</Link></li>
            <li><Link to="/videos" className="hover:text-accent">Videos</Link></li>
            <li><Link to="/blogs" className="hover:text-accent">Blogs</Link></li>
            <li><Link to="/impact" className="hover:text-accent">Impact</Link></li>
            <li><Link to="/about" className="hover:text-accent">About</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Categories</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/category/ai-basics" className="hover:text-accent">AI Basics</Link></li>
            <li><Link to="/category/tools" className="hover:text-accent">Tools</Link></li>
            <li><Link to="/category/career" className="hover:text-accent">Career</Link></li>
            <li><Link to="/category/productivity" className="hover:text-accent">Productivity</Link></li>
            <li><Link to="/category/coding" className="hover:text-accent">Coding</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Get in touch</h4>
          <a href="mailto:hello@hertech.app" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent">
            <Mail className="h-4 w-4" /> hello@hertech.app
          </a>
          <p className="mt-3 text-sm text-muted-foreground">
            Have a question, partnership idea, or feedback? We&apos;d love to hear from you.
          </p>
          <Link to="/contact" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
            Contact us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Digi Sakhi. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-accent">Privacy</a>
            <a href="#" className="hover:text-accent">Terms</a>
            <a href="#" className="hover:text-accent">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
