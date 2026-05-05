import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-20">
      <div className="container-page py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="mb-3"><Logo /></div>
          <p className="text-sm text-muted-foreground">AI & technology content built for women, by women.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/videos" className="hover:text-accent">Videos</Link></li>
            <li><Link to="/blogs" className="hover:text-accent">Blogs</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Categories</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/category/ai-basics" className="hover:text-accent">AI Basics</Link></li>
            <li><Link to="/category/tools" className="hover:text-accent">Tools</Link></li>
            <li><Link to="/category/career" className="hover:text-accent">Career</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Stay in touch</h4>
          <p className="text-sm text-muted-foreground">Get weekly AI & tech insights.</p>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Hertech. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
