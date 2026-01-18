import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { 
  MapPin, 
  Mail, 
  Linkedin, 
  ExternalLink, 
  BookOpen, 
  Trees, 
  Activity, 
  Mic2,
  Download,
  Menu,
  X,
  GraduationCap,
  Briefcase,
  Layers,
  MessageCircle,
  Send,
  Loader2
} from 'lucide-react';

// --- Types & Data ---

const PERSONAL_INFO = {
  name: "Victor M. Martinez-Arias",
  title: "Biologist | MSc. Forest & Environmental Conservation | PhD Candidate",
  email: "vmanuel.martinez@udea.edu.co",
  location: "Antioquia, Colombia",
  orcid: "0000-0002-3328-130X",
  scholar: "https://scholar.google.com/citations?hl=es&user=wfx4nqIAAAAJ",
  affiliation: "Member of GHA - Grupo Herpetológico de Antioquia",
  bio: "Biologist, MSc, and PhD Candidate in Biology with extensive experience in spatial and landscape ecology, ecoacoustics, mammal systematics, and conservation biology. Specialized in data collection, processing, and analysis using multivariate statistics and GIS. I focus on understanding connectivity, soundscapes, and biodiversity patterns to inform conservation strategies.",
};

const INTERESTS = [
  {
    title: "Ecoacoustics",
    description: "Analyzing soundscapes to understand biodiversity patterns and ecosystem health using advanced processing tools.",
    icon: <Mic2 size={32} />,
  },
  {
    title: "Landscape Ecology",
    description: "Studying spatial heterogeneity and its impact on ecological processes, connectivity, and species distribution.",
    icon: <Trees size={32} />,
  },
  {
    title: "Mammalogy",
    description: "Researching mammal systematics, taxonomy, and conservation (Mastozoología), with a focus on Neotropical species.",
    icon: <Activity size={32} />,
  }
];

const EXPERIENCE = [
  {
    role: "PhD Candidate in Biology",
    org: "Universidad de Antioquia",
    period: "2022 - Present",
    desc: "Advisor: PhD. Juan M. Daza Rojas. Focusing on ecoacoustics and landscape ecology.",
  },
  {
    role: "Soundscape Analyst / Sub-coordinator",
    org: "Universidad de Antioquia - SGI",
    period: "2021 - 2022",
    desc: "Soundscape component coordinator for 'Platero' project and acoustic reviewer for 'Kalé'. Analysis of ultrasonic data.",
  },
  {
    role: "Consultant (Data & Ecological Connectivity)",
    org: "Merceditas Corp, Viable S.A.S., Fundación Cunaguaro",
    period: "2011 - 2024",
    desc: "Specialized consultant for over 33 environmental projects involving mammal studies, fauna management, and connectivity models.",
  },
  {
    role: "Fauna Component Coordinator",
    org: "Chemonics International",
    period: "2017 - 2020",
    desc: "Review and construction of reports, spatial analysis, and ecological connectivity assessments.",
  }
];

const EDUCATION = [
  {
    degree: "MSc. Forests and Environmental Conservation",
    school: "Universidad Nacional de Colombia",
    year: "2021",
  },
  {
    degree: "BSc. Biology",
    school: "Universidad de Antioquia",
    year: "2011",
    note: "Advisor: Dr. Sergio Solari",
  },
  {
    degree: "Specialized Course: Data Scientist's Toolbox",
    school: "Johns Hopkins University (Coursera)",
    year: "2020",
  }
];

const SKILLS = {
  languages: ["Spanish (Native)", "English (Professional)"],
  programming: ["R", "Python", "Julia"],
  software: ["QGIS", "ArcGIS", "Raven", "Kaleidoscope", "Circuitscape", "Maxent"],
};

const PUBLICATIONS = [
  {
    title: "Letting ecosystems speak for themselves: An unsupervised methodology for mapping landscape acoustic heterogeneity",
    journal: "Environmental Modelling & Software",
    year: "2025",
    authors: "Rendon, N., Guerrero, M.J., Sanchez-Giraldo, C., Martinez-Arias, V.M., et al.",
  },
  {
    title: "Aves migratorias neárticas–neotropicales en el departamento de Antioquia",
    journal: "Ornitología Colombiana",
    year: "2024",
    authors: "Tejada-Arango, R., Garizábal-Carmona, J.A., Martinez-Arias, V.M.",
  },
  {
    title: "Built vs Green cover: an unequal struggle for urban space in Medellín",
    journal: "Urban Ecosystems",
    year: "2024",
    authors: "Paniagua-Villada, C., Martinez-Arias, V., et al.",
  },
  {
    title: "Predicted distributions of two poorly known small carnivores in Colombia",
    journal: "Mastozoología Neotropical",
    year: "2018",
    authors: "Meza-Joya, F.L., Martinez-Arias, V.M., et al.",
  }
];

// --- Components ---

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: "Hi! I'm Victor's AI assistant. Ask me anything about his research, experience, or publications." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput("");
    const newMessages = [...messages, { role: 'user' as const, text: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: "AIzaSyAtmZ6XpCqjWEhPVmJHosAAz4tZQDOwzqQ" });
      
      const contextData = {
        personal: PERSONAL_INFO,
        interests: INTERESTS,
        experience: EXPERIENCE,
        education: EDUCATION,
        skills: SKILLS,
        publications: PUBLICATIONS
      };

      const systemInstruction = `You are an AI assistant for Victor M. Martinez-Arias's professional portfolio.
      Your task is to answer questions about Victor based STRICTLY on the provided JSON context.

      Context: ${JSON.stringify(contextData)}
      
      Guidelines:
      1. Be polite, professional, and concise (under 100 words).
      2. Respond in the same language as the user (English or Spanish).
      3. If the answer isn't in the context, politely state you only have information about his professional background.
      4. Highlight his expertise in Ecoacoustics and Landscape Ecology when relevant.
      `;

      // Filter out the initial welcome message from the API history to strictly follow user/model turns
      const historyForApi = newMessages.filter((_, i) => i > 0).map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: historyForApi,
        config: {
          systemInstruction: systemInstruction,
        }
      });

      const text = response.text || "I'm sorry, I couldn't generate a response at this time.";
      setMessages(prev => [...prev, { role: 'model', text }]);

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting to the server. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          zIndex: 1001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: 'calc(2rem + 75px)',
          right: '2rem',
          width: 'min(380px, calc(100vw - 4rem))',
          height: '500px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #e5e7eb',
          animation: 'slideUp 0.3s ease-out'
        }}>
          {/* Header */}
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{ 
              width: '32px', height: '32px', 
              backgroundColor: 'rgba(255,255,255,0.2)', 
              borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}>
              <Mic2 size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontFamily: 'Inter, sans-serif' }}>Ask about Victor</h3>
              <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Powered by Gemini</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            backgroundColor: '#f9fafb'
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '85%',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  borderBottomRightRadius: msg.role === 'user' ? '2px' : '12px',
                  borderBottomLeftRadius: msg.role === 'model' ? '2px' : '12px',
                  backgroundColor: msg.role === 'user' ? 'var(--secondary)' : 'white',
                  color: msg.role === 'user' ? 'white' : 'var(--text-main)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  fontSize: '0.95rem'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  borderBottomLeftRadius: '2px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  <Loader2 className="spin" size={20} color="var(--primary)" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{
            padding: '1rem',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '0.5rem',
            backgroundColor: 'white'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                width: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: isLoading || !input.trim() ? 0.7 : 1
              }}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Research', href: '#research' },
    { name: 'Experience', href: '#experience' },
    { name: 'Publications', href: '#publications' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
      boxShadow: scrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
      transition: 'all 0.3s ease',
      padding: '1rem 0',
      color: scrolled ? '#1f2937' : 'white'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="#" style={{ fontWeight: 700, fontSize: '1.2rem', fontFamily: 'Merriweather, serif' }}>
          V.M. Martinez-Arias
        </a>

        {/* Desktop Menu */}
        <div style={{ display: 'none', gap: '2rem', alignItems: 'center' }} className="desktop-menu">
          {links.map(link => (
            <a key={link.name} href={link.href} style={{ fontSize: '0.95rem', fontWeight: 500 }}>
              {link.name}
            </a>
          ))}
          <a href={PERSONAL_INFO.scholar} target="_blank" rel="noreferrer" 
             style={{ 
               padding: '0.5rem 1rem', 
               backgroundColor: scrolled ? 'var(--primary)' : 'rgba(255,255,255,0.2)', 
               color: 'white', 
               borderRadius: '4px',
               fontSize: '0.9rem'
             }}>
            Google Scholar
          </a>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }} className="mobile-toggle">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          padding: '1rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          color: '#1f2937'
        }}>
          {links.map(link => (
            <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} style={{ padding: '0.5rem' }}>
              {link.name}
            </a>
          ))}
        </div>
      )}
      
      <style>{`
        @media (min-width: 768px) {
          .desktop-menu { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="home" style={{
      height: '100vh',
      backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url("P1080838.JPG")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: 'white',
      padding: '0 20px'
    }}>
      <div style={{ maxWidth: '800px', animation: 'fadeIn 1s ease-out' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem', color: 'white' }}>
          {PERSONAL_INFO.name}
        </h1>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', marginBottom: '2rem', fontWeight: 300, opacity: 0.9 }}>
          {PERSONAL_INFO.title}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ border: '1px solid rgba(255,255,255,0.5)', padding: '0.5rem 1rem', borderRadius: '50px', backdropFilter: 'blur(5px)' }}>Ecoacoustics</span>
          <span style={{ border: '1px solid rgba(255,255,255,0.5)', padding: '0.5rem 1rem', borderRadius: '50px', backdropFilter: 'blur(5px)' }}>Landscape Ecology</span>
          <span style={{ border: '1px solid rgba(255,255,255,0.5)', padding: '0.5rem 1rem', borderRadius: '50px', backdropFilter: 'blur(5px)' }}>Mammalogy</span>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="section-padding" style={{ backgroundColor: 'white' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '-20px',
              bottom: '-20px',
              backgroundColor: 'var(--secondary)',
              opacity: 0.2,
              borderRadius: '8px',
              zIndex: 0
            }}></div>
            <img 
              src="P1090332.JPG" 
              alt="Victor M. Martinez-Arias Field Work" 
              style={{ 
                width: '100%', 
                borderRadius: '8px', 
                position: 'relative', 
                zIndex: 1, 
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                aspectRatio: '3/4',
                objectFit: 'cover'
              }} 
            />
          </div>
          
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>About Me</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
              {PERSONAL_INFO.bio}
            </p>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', marginBottom: '2rem' }}>
              I am a proud member of the <strong>GHA (Grupo Herpetológico de Antioquia)</strong> at Universidad de Antioquia. My work bridges the gap between raw data and conservation action, employing advanced technological tools to understand how sound and landscape structure influence biodiversity.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href={`mailto:${PERSONAL_INFO.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600 }}>
                <Mail size={20} /> Contact Me
              </a>
              <a href={PERSONAL_INFO.scholar} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600 }}>
                <BookOpen size={20} /> Publications
              </a>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div style={{ backgroundColor: 'var(--bg-light)', padding: '2rem', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={24} /> Technical Skills
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Data & Programming</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {SKILLS.programming.map(skill => (
                  <span key={skill} style={{ fontSize: '0.9rem', padding: '0.25rem 0.75rem', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Software & GIS</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {SKILLS.software.map(skill => (
                  <span key={skill} style={{ fontSize: '0.9rem', padding: '0.25rem 0.75rem', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

const ResearchInterests = () => {
  return (
    <section id="research" className="section-padding" style={{ backgroundColor: 'var(--bg-light)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem auto' }}>
          <h2>Research Interests</h2>
          <p style={{ color: 'var(--text-light)' }}>My academic and professional journey focuses on these key pillars.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {INTERESTS.map((item, idx) => (
            <div key={idx} style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              overflow: 'hidden', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s ease',
              height: '100%'
            }}>
              {item.title === 'Mammalogy' && (
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img src="DSCN7264.JPG" alt="Mammalogy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ padding: '2rem' }}>
                <div style={{ 
                  width: '60px', height: '60px', 
                  backgroundColor: 'var(--bg-light)', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  marginBottom: '1.5rem'
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-light)' }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Timeline = () => {
  return (
    <section id="experience" className="section-padding" style={{ backgroundColor: 'white' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem' }}>
          
          {/* Experience Column */}
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <Briefcase /> Professional Experience
            </h2>
            <div style={{ borderLeft: '2px solid var(--bg-light)', paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {EXPERIENCE.map((job, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <div style={{ 
                    position: 'absolute', 
                    left: '-2.6rem', 
                    top: '0.25rem', 
                    width: '1.2rem', 
                    height: '1.2rem', 
                    backgroundColor: 'var(--primary)', 
                    borderRadius: '50%',
                    border: '4px solid white'
                  }}></div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--secondary)', fontWeight: 600 }}>{job.period}</span>
                  <h3 style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>{job.role}</h3>
                  <h4 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-light)', marginBottom: '0.5rem' }}>{job.org}</h4>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-light)' }}>{job.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education Column */}
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <GraduationCap /> Education
            </h2>
            <div style={{ borderLeft: '2px solid var(--bg-light)', paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {EDUCATION.map((edu, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <div style={{ 
                    position: 'absolute', 
                    left: '-2.6rem', 
                    top: '0.25rem', 
                    width: '1.2rem', 
                    height: '1.2rem', 
                    backgroundColor: 'var(--accent)', 
                    borderRadius: '50%',
                    border: '4px solid white'
                  }}></div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--secondary)', fontWeight: 600 }}>{edu.year}</span>
                  <h3 style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>{edu.degree}</h3>
                  <h4 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-light)' }}>{edu.school}</h4>
                  {edu.note && <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '0.5rem', fontStyle: 'italic' }}>{edu.note}</p>}
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '4rem' }}>
              <img src="IMG_2901_bw.jpg" alt="Field Team" style={{ width: '100%', borderRadius: '12px', filter: 'grayscale(100%)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', textAlign: 'center', marginTop: '0.5rem' }}>Field work expedition</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const Publications = () => {
  return (
    <section id="publications" className="section-padding" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>Selected Publications</h2>
            <p style={{ opacity: 0.8 }}>Recent contributions to science</p>
          </div>
          <a href={PERSONAL_INFO.scholar} target="_blank" rel="noreferrer" style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', 
            backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.75rem 1.5rem', 
            borderRadius: '50px', backdropFilter: 'blur(5px)', transition: 'background 0.3s'
          }}>
            View all on Google Scholar <ExternalLink size={16} />
          </a>
        </div>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {PUBLICATIONS.map((pub, idx) => (
            <div key={idx} style={{ 
              backgroundColor: 'rgba(255,255,255,0.05)', 
              padding: '1.5rem', 
              borderRadius: '8px',
              borderLeft: '4px solid var(--accent)'
            }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'white' }}>{pub.title}</h3>
              <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600 }}>{pub.journal}</span> • {pub.year}
              </div>
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>{pub.authors}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#111827', color: 'white', padding: '4rem 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          
          <div>
            <h3 style={{ color: 'white', marginBottom: '1rem' }}>{PERSONAL_INFO.name}</h3>
            <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
              Biologist dedicated to understanding and conserving Neotropical biodiversity through ecoacoustics and landscape ecology.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href={`mailto:${PERSONAL_INFO.email}`} style={{ color: 'white', opacity: 0.7 }}><Mail /></a>
              <a href={PERSONAL_INFO.scholar} style={{ color: 'white', opacity: 0.7 }}><BookOpen /></a>
            </div>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.1rem' }}>Contact</h4>
            <ul style={{ listStyle: 'none', padding: 0, color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} /> {PERSONAL_INFO.email}
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} /> {PERSONAL_INFO.location}
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ExternalLink size={16} /> ORCID: {PERSONAL_INFO.orcid}
              </li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.1rem' }}>Affiliation</h4>
            <p style={{ color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Escudo_de_la_Universidad_de_Antioquia.svg" alt="UdeA" style={{ width: '24px', filter: 'invert(1)' }} />
              Universidad de Antioquia
            </p>
            <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>
              GHA - Grupo Herpetológico de Antioquia
            </p>
          </div>

        </div>
        
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} Victor M. Martinez-Arias. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  return (
    <div>
      <Nav />
      <Hero />
      <About />
      <ResearchInterests />
      <Timeline />
      <Publications />
      <Footer />
      <Chatbot />
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
