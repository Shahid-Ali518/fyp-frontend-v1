import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Brain, Heart, Shield, BarChart3, Users, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import heroImage from "@/assets/hero-image.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const stats = [
  { value: "563+", label: "Users Helped" },
  { value: "232+", label: "AI Assessments" },
  { value: "122+", label: "Community Members" },
  { value: "8+", label: "AI Models" },
];

const services = [
  {
    icon: Brain,
    title: "AI Mental Health Assessment",
    description: "Advanced AI algorithms analyze your responses to provide personalized mental health insights and recommendations.",
  },
  {
    icon: Heart,
    title: "Emotion Analysis",
    description: "Real-time emotion detection and tracking through text, voice, and facial expression analysis powered by deep learning.",
  },
  {
    icon: BarChart3,
    title: "Mood Tracking & Analytics",
    description: "Comprehensive mood tracking with visual analytics to help you understand your emotional patterns over time.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description: "Your data is encrypted end-to-end. We prioritize your privacy with HIPAA-compliant security standards.",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "University Student",
    text: "MindfulAI helped me understand my anxiety patterns. The AI assessment was surprisingly accurate and the recommendations genuinely helpful.",
  },
  {
    name: "Dr. Michael Chen",
    role: "Clinical Psychologist",
    text: "As a mental health professional, I'm impressed by the accuracy of the emotion analysis. It's a valuable tool for both patients and practitioners.",
  },
  {
    name: "Amira Patel",
    role: "Working Professional",
    text: "The mood tracking feature changed how I approach my mental wellness. I can finally see the connection between my habits and emotions.",
  },
];

const Index = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-hero-bg">
        <div className="section-padding py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={fadeUp} custom={0}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-light text-primary text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  AI-Powered Mental Health
                </span>
              </motion.div>
              <motion.h1
                variants={fadeUp}
                custom={1}
                className="text-4xl md:text-5xl lg:text-6xl leading-tight text-foreground"
              >
                Healthy Minds,
                <br />
                Happy Lives
              </motion.h1>
              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-muted-foreground text-lg max-w-md leading-relaxed"
              >
                AI-driven mental health assessment and emotion analysis to help
                you understand, track, and improve your emotional wellbeing.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
                <Button variant="coral" size="lg" className="text-base px-8 py-6">
                  Start Free Assessment
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
                <Button variant="outline-hero" size="lg" className="text-base px-8 py-6">
                  Learn More
                </Button>
              </motion.div>
              <motion.div variants={fadeUp} custom={4} className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Free to start
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  100% Private
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  AI-Powered
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={heroImage}
                  alt="Diverse group in a supportive mental health session"
                  width={800}
                  height={800}
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Floating stat card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-background rounded-2xl shadow-lg p-4 border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-coral/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-coral" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-lg">563+</p>
                    <p className="text-xs text-muted-foreground">Users Assessed</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding py-16 bg-primary">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="font-serif text-3xl md:text-4xl text-primary-foreground">{stat.value}</p>
              <p className="text-primary-foreground/70 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-coral font-medium text-sm uppercase tracking-wider"
          >
            Our Services
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl text-foreground mt-3"
          >
            Why Our AI Mental Health Platform Is The Best Choice
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow group"
            >
              <div className="w-14 h-14 rounded-2xl bg-green-light flex items-center justify-center mb-5 group-hover:bg-coral/20 transition-colors">
                <service.icon className="w-7 h-7 text-primary group-hover:text-coral transition-colors" />
              </div>
              <h3 className="font-serif text-xl text-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/services">
            <Button variant="hero" size="lg" className="text-base px-8 py-6">
              View All Services
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-hero-bg section-padding py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-coral font-medium text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl md:text-4xl text-foreground mt-3">What Our Users Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-background rounded-2xl p-8 border border-border"
            >
              <p className="text-muted-foreground leading-relaxed mb-6">"{t.text}"</p>
              <div>
                <p className="font-semibold text-foreground">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary rounded-3xl p-10 md:p-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl text-primary-foreground mb-4">
            Ready to Start Your Mental Wellness Journey?
          </h2>
          <p className="text-primary-foreground/70 max-w-lg mx-auto mb-8 leading-relaxed">
            Take our free AI-powered mental health assessment today and get personalized insights about your emotional wellbeing.
          </p>
          <Button variant="coral" size="lg" className="text-base px-10 py-6">
            Take Free Assessment
            <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
        </motion.div>
      </section>
    </>
  );
};

export default Index;
