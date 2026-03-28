import { Link } from "react-router-dom";
import { Brain, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl">MindfulAI</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              AI-driven mental health assessment and emotion analysis platform. Your journey to better mental wellness starts here.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary-foreground transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-primary-foreground transition-colors">Services</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg">Services</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>Emotion Analysis</li>
              <li>Mental Health Assessment</li>
              <li>AI Therapy Assistant</li>
              <li>Mood Tracking</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg">Contact Us</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-coral" />
                hello@mindfulai.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-coral" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-coral" />
                San Francisco, CA
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} MindfulAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
