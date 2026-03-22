import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Zap, Copy, Check } from 'lucide-react';
import Hero from '../components/Hero';
import Preview from '../components/Preview';
import FeatureGrid from '../components/FeatureGrid';
import TerminalSimulator from '../components/TerminalSimulator';
import { Link } from 'react-router-dom';

export default function Home() {
  const [copied, setCopied] = React.useState(false);
  const [copiedAlias, setCopiedAlias] = React.useState(false);

  const copyInstall = () => {
    navigator.clipboard.writeText('npm install -g @srivtx/snip');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyAlias = () => {
    navigator.clipboard.writeText('alias snip="bunx --bun @srivtx/snip"');
    setCopiedAlias(true);
    setTimeout(() => setCopiedAlias(false), 2000);
  };

  return (
    <>
      {/* Glow orbs sit behind content but above textures */}
      <div className="glow" style={{ top: '-10%', left: '-5%', zIndex: 1 }} />
      <div className="glow" style={{ bottom: '10%', right: '0%', zIndex: 1 }} />

      <Hero />

      <div id="demo">
        <Preview />
      </div>

      {/* ── TERMINAL & CONTENT ARE SHARP ON TOP ── */}
      <div className="on-top">
        <TerminalSimulator />
      </div>

      <div id="features">
        <FeatureGrid />
      </div>

      {/* ── CINEMATIC PRODUCT REVEAL (Transparent background behind) ── */}
      <section style={{ padding: '120px 0', background: 'transparent', position: 'relative' }}>
        <div className="container">
          <div style={{ marginBottom: '80px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--color-accent)', marginBottom: '16px' }}>
              Media Engine
            </div>
            <h2 style={{ fontSize: '64px', fontWeight: 900, letterSpacing: '-3px', lineHeight: 1 }}>Cinematic Production.</h2>
            <p style={{ color: 'var(--color-secondary)', fontSize: '18px', maxWidth: '600px', margin: '30px auto 0' }}>
              Snip isn't just a utility. It's a professional-grade media engine capable of producing high-engagement technical assets.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '100%',
              aspectRatio: '16/9',
              overflow: 'hidden',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              background: 'rgba(5, 5, 5, 0.5)',
              boxShadow: '0 100px 200px -20px rgba(0,0,0,1)',
              position: 'relative'
            }}
          >
            <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)', pointerEvents: 'none', zIndex: 2 }} />
            <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
              <source src="/video.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </div>
      </section>

      {/* ── PERFORMANCE (BUN ALIAS) ── */}
      <section style={{ padding: '160px 0', borderTop: '1px solid var(--color-border)', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle glow right side */}
        <div style={{ position: 'absolute', top: '50%', right: '0%', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(248,231,28,0.03) 0%, transparent 70%)', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 0 }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '80px', alignItems: 'center' }}>
            
            <div style={{ flex: '1 1 400px' }}>
              <motion.div 
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px', color: '#f8e71c', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}
              >
                <Zap size={14} /> Maximum Performance
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
                style={{ fontSize: '56px', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: '24px' }}
              >
                Snip runs at the <br/>speed of light.
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
                style={{ color: 'var(--color-secondary)', fontSize: '18px', lineHeight: 1.6, marginBottom: '40px', maxWidth: '440px' }}
              >
                Snip is highly optimized for <strong style={{ color: '#fff' }}>Node.js</strong>. But if you have <strong style={{ color: '#fff' }}>Bun</strong> installed, you can bind this alias to your shell profile to instantly traverse the Bun engine.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
                onClick={copyAlias}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--color-border)',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  transition: '0.2s',
                  maxWidth: '440px'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ color: '#888', userSelect: 'none' }}>$</span>
                  <span style={{ color: '#fff', fontSize: '14px' }}>alias snip="bunx --bun @srivtx/snip"</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '1px', height: '16px', background: 'var(--color-border)' }} />
                  {copiedAlias ? <Check size={14} color="#fff" /> : <Copy size={14} className="text-dim" />}
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}
                style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '12px', fontFamily: 'var(--font-mono)' }}
              >
                To remove: run <code style={{ color: 'rgba(255,255,255,0.6)' }}>unalias snip</code> or remove from your .zshrc
              </motion.p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
              style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}
            >
              <div style={{
                width: '100%',
                background: '#050505',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: '24px',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                color: 'var(--color-secondary)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 40px 80px -20px rgba(0,0,0,0.8)'
              }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '5px', background: '#333' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '5px', background: '#333' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '5px', background: '#333' }} />
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#888' }}>$</span> <span style={{ color: '#fff' }}>time snip snippet.js</span>
                </div>
                <div style={{ color: '#888', marginBottom: '24px' }}>
                  node execution  <span style={{ color: '#ff4444' }}>0.24s user</span> 0.04s system
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#f8e71c' }}>$</span> <span style={{ color: '#fff' }}>time bunx --bun snip snippet.js</span>
                </div>
                <div style={{ color: '#888', marginBottom: '24px' }}>
                  bun execution   <span style={{ color: '#f8e71c' }}>0.01s user</span> 0.01s system
                </div>
                
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(transparent, #050505)' }} />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── INDUSTRIAL CTA ── */}
      <section style={{ padding: '200px 0', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '40px' }}>
              {[1, 2, 3].map(i => <div key={i} style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#333' }} />)}
            </div>
            <h2 style={{ fontSize: '100px', lineHeight: 0.8, marginBottom: '50px', fontWeight: 900, letterSpacing: '-5px' }}>Build Better <br />Assets.</h2>
            <p style={{ fontSize: '20px', color: 'var(--color-secondary)', marginBottom: '60px', maxWidth: '550px', margin: '0 auto 60px auto' }}>
              Standardize your technical communication with the most powerful terminal toolkit ever built.
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '40px' }}>
              <button className="btn-studio" onClick={copyInstall}>{copied ? '✓ Copied to Clipboard' : 'Initialize Snip'}</button>
              <Link to="/docs" style={{ textDecoration: 'none' }}>
                <button className="btn-studio-secondary" style={{ gap: '10px' }}>
                  Documentation <ArrowUpRight size={16} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
