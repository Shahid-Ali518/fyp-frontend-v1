import { motion } from "framer-motion";
import { Heart, Target, Eye, Users, Award, Lightbulb } from "lucide-react";
import Layout from "@/components/Layout";
import aboutImage from "@/assets/about-image.jpg";

const values = [
  {
    icon: Heart,
    title: "Compassion First",
    description: "We approach mental health with empathy, ensuring every interaction feels safe and supportive.",
  },
  {
    icon: Target,
    title: "Evidence-Based",
    description: "Our AI models are trained on clinically validated frameworks and peer-reviewed research.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "We believe in clear communication about how our AI works and how your data is used.",
  },
  {
    icon: Users,
    title: "Inclusivity",
    description: "Our platform is designed to be accessible and culturally sensitive to all communities.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We continuously refine our models to provide the most accurate mental health insights.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Pioneering the use of AI in mental health to make assessment accessible and affordable.",
  },
];

const team = [
  { name: "Shahid Ali", role: "Team Lead", bg: "bg-green-light" },
  { name: "Saqib Akbar", role: "Backend Engineer", bg: "bg-coral/20" },
  { name: "Muhammad Usman", role: "Frontend Developer", bg: "bg-secondary" },
  { name: "Usman Masih", role: "Funny Guy", bg: "bg-green-light" },
];

const About = () => {
  return (
    <>
      {/* Hero */}
      <section className="bg-hero-bg section-padding py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="text-coral font-medium text-sm uppercase tracking-wider">About Us</span>
            <h1 className="text-4xl md:text-5xl text-foreground leading-tight">
              Empowering Mental Wellness Through AI
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
              MindfulAI was founded with a simple yet powerful mission: to make mental health assessment
              accessible, affordable, and stigma-free through the power of artificial intelligence.
            </p>
            <p className="text-muted-foreground leading-relaxed max-w-lg">
              We combine advanced emotion analysis algorithms with clinically validated frameworks to
              provide accurate, personalized mental health insights — anytime, anywhere.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <img
                src={aboutImage}
                alt="Calming wellness workspace"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary rounded-2xl p-10"
          >
            <h3 className="font-serif text-2xl text-primary-foreground mb-4">Our Mission</h3>
            <p className="text-primary-foreground/80 leading-relaxed">
              To democratize mental health care by providing AI-powered assessment and emotion analysis
              tools that are accurate, private, and accessible to everyone regardless of their
              socioeconomic background.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl p-10 border border-border"
          >
            <h3 className="font-serif text-2xl text-foreground mb-4">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              A world where everyone has access to early mental health detection and support,
              where AI acts as a compassionate bridge between individuals and the professional help
              they need.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-hero-bg section-padding py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-coral font-medium text-sm uppercase tracking-wider">Our Values</span>
          <h2 className="text-3xl md:text-4xl text-foreground mt-3">What Drives Us Forward</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-background rounded-2xl p-8 border border-border hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-green-light flex items-center justify-center mb-4">
                <v.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-lg text-foreground mb-2">{v.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="section-padding py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-coral font-medium text-sm uppercase tracking-wider">Our Team</span>
          <h2 className="text-3xl md:text-4xl text-foreground mt-3">Meet The Experts</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className={`w-32 h-32 rounded-full ${member.bg} mx-auto mb-4 flex items-center justify-center`}>
                <Users className="w-12 h-12 text-primary/40" />
              </div>
              <h3 className="font-semibold text-foreground">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

export default About;
