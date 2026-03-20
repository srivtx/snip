import React, { useState, useEffect } from 'react';
import { Copy, Check, Terminal, Search, Palette, User, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ALL_COMMANDS = [
  {
    id: 'snippet', category: 'Core Engine', name: 'Code Snippets', cmd: 'snip app.js --theme tokyo-night',
    desc: 'Generate studio-grade syntax highlighted cards directly from any local file or piped input. Designed for technical communications on X and LinkedIn.',
    bg: 'linear-gradient(135deg, #6C3CE1 0%, #E14B9E 50%, #F7971E 100%)',
    render: () => (
      <div className="card-studio" style={{ background: '#050505', border: '1px solid rgba(255,255,255,0.05)', width: '100%', maxWidth: '560px' }}>
        <div style={{ display: 'flex', padding: '14px 20px', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }}></div>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e' }}></div>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }}></div>
          <div style={{ flex: 1, textAlign: 'center', color: '#444', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', paddingRight: '40px' }}>app.js</div>
        </div>
        <div style={{ padding: '40px', fontFamily: 'var(--font-mono)', fontSize: '15px', lineHeight: '1.8', color: '#fff' }}>
          <span style={{ color: '#ff79c6' }}>import</span> React <span style={{ color: '#ff79c6' }}>from</span> <span style={{ color: '#f1fa8c' }}>'react'</span>;<br /><br />
          <span style={{ color: '#ff79c6' }}>export function</span> <span style={{ color: '#50fa7b' }}>App</span>() {'{'}<br />
          &nbsp;&nbsp;<span style={{ color: '#6272a4' }}>// Built for precision.</span><br />
          &nbsp;&nbsp;<span style={{ color: '#ff79c6' }}>return</span> <span style={{ color: '#8be9fd' }}>&lt;div&gt;</span>Hello Studio<span style={{ color: '#8be9fd' }}>&lt;/div&gt;</span>;<br />
          {'}'}
        </div>
      </div>
    )
  },
  {
    id: 'mockup', category: 'Core Engine', name: 'Browser Mockups', cmd: 'snip mockup dashboard.png',
    desc: 'Automatically wrap any image or UI element in a perfectly proportioned macOS or Safari browser frame. Instantly upgrades any boring screenshot.',
    bg: 'linear-gradient(135deg, #0F2027 0%, #203A43 40%, #2C5364 100%)',
    render: () => (
      <div className="card-studio" style={{ background: '#0a0a0a', width: '100%', maxWidth: '560px', overflow: 'hidden' }}>
        <div style={{ height: '40px', background: '#111', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }} />
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '4px 40px', borderRadius: '6px', fontSize: '11px', color: '#555', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>example.com</div>
          </div>
        </div>
        <div style={{ height: '260px', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid rgba(255,255,255,0.02)' }}>
          <div style={{ opacity: 0.1, fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 900, letterSpacing: '-1px' }}>DASHBOARD UI</div>
        </div>
      </div>
    )
  },
  {
    id: 'diagram', category: 'Core Engine', name: 'Mermaid Diagrams', cmd: 'snip diagram "User -> API -> Database"',
    desc: 'Generate gorgeous, fully themed block diagrams and flowcharts in seconds using shorthand Mermaid.js syntax from your CLI.',
    bg: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    render: () => (
      <div className="card-studio" style={{ padding: '60px 40px', background: 'rgba(30, 30, 46, 0.95)', backdropFilter: 'blur(10px)', width: '100%', maxWidth: '560px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#cdd6f4', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>User</div>
        <div style={{ flex: 1, minWidth: '30px', height: '2px', background: 'rgba(255,255,255,0.2)', position: 'relative' }}>
          <div style={{ position: 'absolute', right: '-4px', top: '-4px', width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid rgba(255,255,255,0.2)' }} />
        </div>
        <div style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#cdd6f4', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>API</div>
        <div style={{ flex: 1, minWidth: '30px', height: '2px', background: 'rgba(255,255,255,0.2)', position: 'relative' }}>
          <div style={{ position: 'absolute', right: '-4px', top: '-4px', width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid rgba(255,255,255,0.2)' }} />
        </div>
        <div style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#cdd6f4', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Database</div>
      </div>
    )
  },
  {
    id: 'video', category: 'Motion Graphics', name: 'Cinematic Video', cmd: 'snip video app.js --theme nord',
    desc: 'Automatically render your code as a smooth, beautifully padded scrolling MP4 video to post natively on Twitter or LinkedIn.',
    bg: 'linear-gradient(135deg, #FF0099 0%, #493240 50%, #00DBDE 100%)',
    render: () => (
      <div className="card-studio" style={{ display: 'flex', flexDirection: 'column', padding: '30px', background: '#2e3440', width: '100%', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '16px solid #000', marginLeft: '4px' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#bf616a' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ebcb8b' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#a3be8c' }} />
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#d8dee9', lineHeight: '1.6', filter: 'blur(2px)' }}>
          <span style={{ color: '#81a1c1' }}>async function</span> <span style={{ color: '#88c0d0' }}>capture</span>() {'{'}<br />
          &nbsp;&nbsp;<span style={{ color: '#81a1c1' }}>const</span> frame = <span style={{ color: '#81a1c1' }}>await</span> render();<br />
          &nbsp;&nbsp;<span style={{ color: '#616e88' }}>// generating 60fps MP4...</span><br />
          {'}'}
        </div>
      </div>
    )
  },
  {
    id: 'product-video', category: 'Motion Graphics', name: 'Website Tours', cmd: 'snip tool product-video srivtx.tech',
    desc: 'Type any URL to instantly generate a cinematic, eased scroll MP4 product tour enclosed in a gorgeous 3D macOS window wrapper. Huge time saver.',
    bg: 'linear-gradient(135deg, #F12711 0%, #f5af19 100%)',
    render: () => (
      <div className="card-studio" style={{ background: '#0a0a0a', width: '100%', maxWidth: '560px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ height: '40px', background: '#111', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }} />
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '4px 40px', borderRadius: '6px', fontSize: '11px', color: '#555', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>srivtx.tech</div>
          </div>
        </div>
        <div style={{ height: '260px', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '20px', width: '80%', height: '400px', background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)', borderRadius: '12px' }} />
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 10 }}>
            <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '16px solid #000', marginLeft: '4px' }} />
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'post', category: 'Social Web', name: 'Social Cards', cmd: 'snip post "Shipped Snip v1.0 🚀"',
    desc: 'Bypass the algorithm with perfectly optimized image cards. Embeds your customized avatar and handle from ~/.sniprc.json.',
    bg: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    render: () => (
      <div className="card-studio" style={{ background: '#15202b', padding: '30px', width: '100%', maxWidth: '480px', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <img src="/cat.jpg" alt="Author" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.05)' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '16px', color: '#e7e9ea' }}>Engineering Toolkit</div>
            <div style={{ color: '#71767b', fontSize: '14px' }}>@snip_engine</div>
          </div>
        </div>
        <div style={{ fontSize: '22px', lineHeight: 1.4, color: '#e7e9ea', letterSpacing: '-0.3px', fontWeight: 500 }}>
          Shipped Snip v1.0. 🚀<br /><br />
          The ultimate media engine for developers.
        </div>
      </div>
    )
  },
  {
    id: 'bg-remove', category: 'Image Engine', name: 'AI Matting', cmd: 'snip image bg-remove avatar.jpg',
    desc: 'Strip backgrounds from images natively and entirely offline using the local @imgly machine learning engine.',
    bg: 'linear-gradient(135deg, #0cebeb 0%, #20e3b2 50%, #29ffc6 100%)',
    render: () => (
      <div className="card-studio" style={{ display: 'flex', width: '100%', maxWidth: '560px', height: '260px', overflow: 'hidden' }}>
        <div style={{ flex: 1, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 900, color: '#000' }}>snip.</div>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'linear-gradient(45deg, #111 25%, transparent 25%), linear-gradient(-45deg, #111 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #111 75%), linear-gradient(-45deg, transparent 75%, #111 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 900, color: '#fff' }}>snip.</div>
        </div>
      </div>
    )
  },
  {
    id: 'diff-tool', category: 'Developer Utilities', name: 'Visual Diffs', cmd: 'snip tool diff v1.js v2.js',
    desc: 'Generate gorgeous side-by-side or inline code comparisons. Ideal for changelog updates, pull request descriptions, and documentation.',
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    render: () => (
      <div className="card-studio" style={{ background: '#050505', width: '100%', maxWidth: '560px' }}>
        <div style={{ padding: '14px', background: 'rgba(0,0,0,0.5)', color: '#444', fontFamily: 'var(--font-mono)', fontSize: '11px', textAlign: 'center', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>v1.js versus v2.js</div>
        <div style={{ padding: '30px', fontFamily: 'var(--font-mono)', fontSize: '14px', lineHeight: '1.8' }}>
          <div style={{ display: 'flex', gap: '16px', color: '#444', marginBottom: '4px' }}>
            <span>1</span> <span style={{ color: '#fff' }}>const engine = <span style={{ color: '#ff79c6' }}>new</span> Engine();</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', color: '#d08770', background: 'rgba(191, 97, 106, 0.1)', padding: '4px 0 4px 10px', marginLeft: '-10px', borderRadius: '4px', marginBottom: '4px' }}>
            <span>-</span> <span>engine.start(0.9);</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', color: '#a3be8c', background: 'rgba(163, 190, 140, 0.1)', padding: '4px 0 4px 10px', marginLeft: '-10px', borderRadius: '4px' }}>
            <span>+</span> <span>await engine.start(1.0);</span>
          </div>
        </div>
      </div>
    )
  }
];

function InteractiveTerminal({ command }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card-studio" style={{ background: '#000', padding: '24px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'var(--font-mono)', fontSize: '15px' }}>
        <span style={{ color: 'var(--color-accent)' }}>~</span>
        <span style={{ color: '#fff', fontWeight: 600 }}>{command}</span>
      </div>
      <div
        onClick={handleCopy}
        style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 14px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: '0.2s', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        {copied ? <Check size={14} color="#fff" /> : <Copy size={14} color="var(--color-secondary)" />}
        <span style={{ fontSize: '12px', fontWeight: 700, color: copied ? '#fff' : 'var(--color-secondary)', letterSpacing: '1px' }}>{copied ? 'COPIED' : 'COPY'}</span>
      </div>
    </div>
  );
}

export default function CommandDocs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredCommands = ALL_COMMANDS.filter(cmd =>
    cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.cmd.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToCommand = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      {/* CMD+K MODAL */}
      <AnimatePresence>
        {isSearchOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15vh' }}>
            {/* Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }}
            />
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              style={{
                position: 'relative', width: '90%', maxWidth: '640px', background: '#0a0a0a',
                borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden',
                boxShadow: '0 40px 100px rgba(0,0,0,0.8)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Search size={20} color="var(--color-secondary)" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search tools & commands..."
                  style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '18px', padding: '0 16px', outline: 'none' }}
                />
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-secondary)', background: 'rgba(255,255,255,0.05)', padding: '6px 10px', borderRadius: '6px' }}>ESC</div>
              </div>

              <div className="hide-scroll" style={{ maxHeight: '400px', overflowY: 'auto', padding: '12px' }}>
                <div style={{ padding: '8px 16px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#555' }}>
                  {searchQuery ? 'Results' : 'Suggestions'}
                </div>
                {filteredCommands.length > 0 ? (searchQuery ? filteredCommands : filteredCommands.slice(0, 5)).map(cmd => (
                  <div
                    key={cmd.id}
                    onClick={() => scrollToCommand(cmd.id)}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    style={{
                      padding: '16px 20px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      transition: '0.2s'
                    }}
                  >
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', textAlign: 'left' }}>{cmd.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)', textAlign: 'left' }}>{cmd.cmd}</div>
                  </div>
                )) : (
                  <div style={{ padding: '30px', color: 'var(--color-secondary)', fontSize: '14px', textAlign: 'center' }}>No sequences matched.</div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GLOBAL BACKGROUND ELEMENTS */}
      <div className="texture-halftone" style={{ opacity: 0.1 }} />
      <div className="glow" style={{ top: '0', right: '0', opacity: 0.4 }} />

      <style>
        {`
          .docs-section-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 100px;
            align-items: center;
          }
          .docs-text { order: 1; }
          .docs-visual { order: 2; }

          .docs-section-grid.reversed .docs-text { order: 2; }
          .docs-section-grid.reversed .docs-visual { order: 1; }

          @media (max-width: 900px) {
            .docs-section-grid {
              grid-template-columns: 1fr;
              gap: 60px;
            }
            .docs-section-grid.reversed .docs-text, 
            .docs-text { order: 1 !important; }
            .docs-section-grid.reversed .docs-visual, 
            .docs-visual { order: 2 !important; }
          }
        `}
      </style>

      {/* MANUAL HERO */}
      <section style={{ padding: '140px 0 120px 0', textAlign: 'center', position: 'relative' }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>

          {/* SEARCH TRIGGER BUTTON */}
          <button
            onClick={() => setIsSearchOpen(true)}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
              padding: '14px 20px', borderRadius: '14px', color: 'var(--color-secondary)',
              fontSize: '15px', cursor: 'pointer', margin: '0 auto 80px auto',
              transition: '0.2s', width: '100%', maxWidth: '340px'
            }}
          >
            <Search size={18} />
            <span>Search documentation...</span>
            <div style={{ flex: 1 }} />
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              background: 'rgba(255,255,255,0.05)', padding: '6px 10px',
              borderRadius: '6px', fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-sans)', color: '#fff'
            }}>
              ⌘ K
            </div>
          </button>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '30px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'var(--color-accent)' }} />
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--color-accent)' }}>The Manual</span>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'var(--color-accent)' }} />
          </div>
          <h1 style={{ fontSize: 'clamp(60px, 10vw, 130px)', lineHeight: 0.8, fontWeight: 900, letterSpacing: '-5px', margin: 0 }}>
            Command<br />Reference.
          </h1>
          <p style={{ fontSize: '24px', color: 'var(--color-secondary)', maxWidth: '700px', margin: '40px auto 0 auto', lineHeight: 1.6 }}>
            The definitive guide to utilizing Snip's capabilities one-by-one. Scroll to explore the entire toolkit.
          </p>
        </div>
      </section>

      {/* LINEAR SCROLLING SECTIONS */}
      {ALL_COMMANDS.map((cmd, index) => {
        const isReversed = index % 2 !== 0;

        return (
          <section id={cmd.id} key={cmd.id} style={{ padding: '160px 0', borderTop: index === 0 ? 'none' : '1px solid var(--color-border)', position: 'relative', overflow: 'hidden' }}>
            {/* Subtle row-specific glow */}
            {isReversed && <div className="glow" style={{ top: '50%', left: '-20%', transform: 'translateY(-50%)', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.05) 0%, transparent 60%)' }} />}

            <div className="container" style={{ position: 'relative', zIndex: 10 }}>
              <div className={`docs-section-grid ${isReversed ? 'reversed' : ''}`}>

                {/* TEXT CONTENT */}
                <div className="docs-text">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-primary)', marginBottom: '24px' }}>
                    <Terminal size={18} color="var(--color-accent)" />
                    <span style={{ fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-secondary)' }}>{cmd.category}</span>
                  </div>
                  <h2 style={{ fontSize: '56px', fontWeight: 900, lineHeight: 1, marginBottom: '30px', letterSpacing: '-2px' }}>
                    {cmd.name}.
                  </h2>
                  <p style={{ fontSize: '18px', color: 'var(--color-secondary)', lineHeight: 1.6, marginBottom: '50px', maxWidth: '500px' }}>
                    {cmd.desc}
                  </p>
                  <InteractiveTerminal command={cmd.cmd} />
                </div>

                {/* VISUAL SHOWCASE */}
                <div className="docs-visual" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{
                    background: cmd.bg,
                    width: '100%',
                    padding: 'clamp(40px, 8vw, 100px)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 80px 160px -30px rgba(0,0,0,0.8)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Glass reflection */}
                    <div style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, height: '100%',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
                      pointerEvents: 'none'
                    }} />
                    <div style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', justifyContent: 'center' }}>
                      {cmd.render()}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        );
      })}

      {/* GLOBAL CONFIGURATION SECTION */}
      <section id="configuration" style={{ padding: '160px 0', borderTop: '1px solid var(--color-border)', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="docs-section-grid">

            {/* TEXT CONTENT */}
            <div className="docs-text">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-primary)', marginBottom: '24px' }}>
                <Settings2 size={18} color="var(--color-accent)" />
                <span style={{ fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-secondary)' }}>Global Settings</span>
              </div>
              <h2 style={{ fontSize: '56px', fontWeight: 900, lineHeight: 1, marginBottom: '30px', letterSpacing: '-2px' }}>
                Configure<br />Your Identity.
              </h2>
              <p style={{ fontSize: '18px', color: 'var(--color-secondary)', lineHeight: 1.6, marginBottom: '40px', maxWidth: '500px' }}>
                Snip isn't just a generic CLI utility—it's your personalized publishing engine. Configure your digital identity once, and perfectly brand every single generated asset visually.
              </p>

              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '15px', color: '#fff', marginBottom: '16px', fontWeight: 700 }}>Interactive Setup Guide</h3>
                <InteractiveTerminal command="snip config --init" />
                <p style={{ fontSize: '14px', color: 'var(--color-secondary)', marginTop: '16px', lineHeight: 1.6, maxWidth: '440px' }}>
                  Run the initialization command anywhere. The CLI wizard will interactively prompt you for your preferred theme, your social handle, and the path to your avatar image, securely saving them for all future generations.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}><Palette size={20} color="var(--color-accent)" /></div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>Default Themes</div>
                    <div style={{ color: 'var(--color-secondary)', fontSize: '14px' }}>Lock in your favorite syntax colors globally.</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}><User size={20} color="var(--color-accent)" /></div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>Social Presence</div>
                    <div style={{ color: 'var(--color-secondary)', fontSize: '14px' }}>Automatically inject handles and custom avatars.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* VISUAL SHOWCASE */}
            <div className="docs-visual" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{
                background: 'linear-gradient(135deg, #1f1c2c 0%, #928DAB 100%)',
                width: '100%', padding: 'clamp(40px, 8vw, 100px)',
                borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                boxShadow: '0 80px 160px -30px rgba(0,0,0,0.8)', position: 'relative', overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)', pointerEvents: 'none' }} />

                <div className="card-studio" style={{ width: '100%', maxWidth: '380px', background: '#0a0a0a', padding: '30px', borderRadius: '24px', position: 'relative', zIndex: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px' }}>
                    <img src="/cat.jpg" alt="Profile" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.05)' }} />
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Sribatsha Dash</div>
                      <div style={{ fontSize: '14px', color: 'var(--color-secondary)' }}>@srivtx</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color: 'var(--color-secondary)', fontSize: '14px', fontWeight: 600 }}>Syntax Theme</span>
                      <span style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>Tokyo Night</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color: 'var(--color-secondary)', fontSize: '14px', fontWeight: 600 }}>Avatar Inject</span>
                      <div style={{ width: '38px', height: '22px', background: 'var(--color-accent)', borderRadius: '20px', position: 'relative' }}>
                        <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', right: '3px' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ padding: '200px 0', borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '100px', lineHeight: 0.8, marginBottom: '50px', fontWeight: 900, letterSpacing: '-5px' }}>End of Manual.</h2>
          <p style={{ fontSize: '20px', color: 'var(--color-secondary)', marginBottom: '60px', maxWidth: '550px', margin: '0 auto 60px auto' }}>
            You've explored the core capabilities of the most powerful developer rendering engine ever crafted.
          </p>
          <button className="btn-studio">Return to Top</button>
        </div>
      </section>
    </>
  );
}
