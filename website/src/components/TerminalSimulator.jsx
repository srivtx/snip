import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Command, ChevronRight } from 'lucide-react';

const SCENARIOS = [
  { cmd: 'snip image compress logo.png --quality 80', result: 'OPTIMIZING... SAVED 64.2%' },
  { cmd: 'snip diagram "User -> API -> Database"', result: 'RENDERING FLOWCHART...' },
  { cmd: 'snip tool og "New Post" --bg neon', result: 'GENERATING ASSETS...' },
  { cmd: 'snip image bg-remove profile.jpg', result: 'AI MATTING IN PROGRESS...' },
];

export default function TerminalSimulator() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout;
    const currentCmd = SCENARIOS[index].cmd;

    if (isTyping) {
      if (text.length < currentCmd.length) {
        timeout = setTimeout(() => {
          setText(currentCmd.slice(0, text.length + 1));
        }, 50);
      } else {
        timeout = setTimeout(() => setIsTyping(false), 2000);
      }
    } else {
      timeout = setTimeout(() => {
        setText('');
        setIsTyping(true);
        setIndex((prev) => (prev + 1) % SCENARIOS.length);
      }, 1000);
    }

    return () => clearTimeout(timeout);
  }, [text, isTyping, index]);

  return (
    <section style={{ padding: '100px 0', borderTop: '1px solid var(--color-border)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-primary)', marginBottom: '24px' }}>
              <Command size={18} />
              <span style={{ fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px' }}>Interactive Shell</span>
            </div>
            <h2 style={{ fontSize: '56px', fontWeight: 900, lineHeight: 1, marginBottom: '30px' }}>Command <br />Your Workflow.</h2>
            <p style={{ fontSize: '18px', color: 'var(--color-secondary)', lineHeight: 1.6 }}>
              A single unified command for everything. No more switching between websites or heavy design apps.
            </p>
          </div>

          <div className="card-studio" style={{ background: '#000', padding: '30px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#222' }}></div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#222' }}></div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#222' }}></div>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', flex: 1 }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
                <span style={{ color: 'var(--color-accent)' }}>~</span>
                <span style={{ color: '#fff' }}>{text}</span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  style={{ width: '8px', height: '18px', background: 'var(--color-primary)' }}
                />
              </div>

              <AnimatePresence>
                {!isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ color: '#444', display: 'flex', flexDirection: 'column', gap: '4px' }}
                  >
                    <div>{SCENARIOS[index].result}</div>
                    <div style={{ color: '#28c840' }}>✔ DONE. COPIED TO CLIPBOARD.</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.2 }}>
              <span style={{ fontSize: '10px' }}>SNIP_ENGINE_REEL_v1.0</span>
              <Terminal size={12} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
