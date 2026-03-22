import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Copy, Check, ArrowRight, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Hero() {
  const [copied, setCopied] = React.useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText('bun add -g @srivtx/snip --trusted');
    setCopied(true);

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFFFFF', '#888888', '#444444']
    });

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section style={{ padding: '120px 0 60px 0', position: 'relative' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: '100px',
                fontSize: '9px',
                fontWeight: 900,
                letterSpacing: '2px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textTransform: 'uppercase',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
              }}>
                <Zap size={10} color="#f8e71c" strokeWidth={3} /> Superior Offline RAG v2
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '3px', opacity: 0.4 }}>
                Engineering Utility / V1.0
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(45px, 14vw, 140px)',
              lineHeight: 0.8,
              letterSpacing: '-0.07em',
              marginBottom: '50px',
              fontWeight: 900,
              color: '#fff',
            }}>
              Terminal <br />
              <span style={{ color: '#fff' }}>Supercharged.</span>
            </h1>

            <p style={{
              fontSize: '20px',
              color: 'var(--color-secondary)',
              maxWidth: '700px',
              margin: '0 auto 60px auto',
              lineHeight: 1.5,
              fontWeight: 500,
            }}>
              The high-fidelity media engine for developers. Generate snippets, diagrams, and cinematic production directly from your CLI.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div className="hero-actions">
                <button className="btn-studio" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>
                  Explore Studio <ArrowRight size={16} />
                </button>

                <div
                  onClick={copyCommand}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--color-border)',
                    padding: '12px clamp(12px, 3vw, 24px)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'clamp(11px, 3.5vw, 14px)',
                    transition: '0.2s',
                    width: 'fit-content',
                    maxWidth: '100%',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                >
                  <span style={{ color: '#fff', fontWeight: 600 }}>bun add -g @srivtx/snip</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '1px', height: '16px', background: 'var(--color-border)' }} />
                    {copied ? <Check size={14} color="#fff" /> : <Copy size={14} className="text-dim" />}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--color-secondary)', opacity: 0.7, fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
                <Zap size={10} color="#f8e71c" style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                Bun is 100x faster, but <span style={{ color: '#fff' }}>npm i -g @srivtx/snip</span> works too.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
