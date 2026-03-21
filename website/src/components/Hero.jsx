import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Copy, Check, ArrowRight, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Hero() {
  const [copied, setCopied] = React.useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText('npm install -g @srivtx/snip');
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
    <section style={{ padding: '180px 0 120px 0', position: 'relative' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '40px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '3px', opacity: 0.4 }}>
                Engineering Utility / V1.0
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(64px, 14vw, 140px)',
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

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap'
            }}>
              <button className="btn-studio" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore Studio <ArrowRight size={16} />
              </button>

              <div
                onClick={copyCommand}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--color-border)',
                  padding: '12px 24px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  transition: '0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
              >
                <Terminal size={14} className="text-dim" />
                <span style={{ color: '#fff', fontWeight: 600 }}>npm i -g @srivtx/snip</span>
                <div style={{ width: '1px', height: '16px', background: 'var(--color-border)' }} />
                {copied ? <Check size={14} color="#fff" /> : <Copy size={14} className="text-dim" />}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
