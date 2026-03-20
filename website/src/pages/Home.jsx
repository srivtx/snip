import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Hero from '../components/Hero';
import Preview from '../components/Preview';
import FeatureGrid from '../components/FeatureGrid';
import TerminalSimulator from '../components/TerminalSimulator';
import { Link } from 'react-router-dom';

export default function Home() {
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
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <button className="btn-studio">Initialize Snip</button>
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
