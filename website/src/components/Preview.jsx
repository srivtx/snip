import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Preview() {
  const [background, setBackground] = useState('candy');
  
  const bgs = {
    candy: 'linear-gradient(135deg, #6C3CE1 0%, #E14B9E 50%, #F7971E 100%)',
    neon: 'linear-gradient(135deg, #FF0099 0%, #493240 50%, #00DBDE 100%)',
    ocean: 'linear-gradient(135deg, #0F2027 0%, #203A43 40%, #2C5364 100%)',
    midnight: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  };

  return (
    <section id="demo" style={{ padding: '120px 0' }}>
      <div className="container">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '100px',
          alignItems: 'center'
        }}>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              background: bgs[background],
              padding: 'clamp(30px, 5vw, 100px)',
              borderRadius: 'var(--radius-lg)',
              position: 'relative',
              boxShadow: '0 80px 160px -30px rgba(0,0,0,0.8)',
              overflow: 'hidden',
              transition: 'background 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {/* Glass reflection */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, height: '100%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
              pointerEvents: 'none'
            }} />

            <div className="card-studio" style={{ 
              background: '#050505', 
              border: '1px solid rgba(255,255,255,0.05)',
              width: '100%',
              maxWidth: '100%'
            }}>
              <div style={{ display: 'flex', padding: '14px 20px', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                {/* Fixed Dots: Red, Yellow, Green */}
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }}></div>
                <div style={{ flex: 1, textAlign: 'center', color: '#444', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', paddingRight: '40px' }}>snip.engine</div>
              </div>
              <div style={{ 
                padding: '40px', 
                fontFamily: 'var(--font-mono)', 
                fontSize: '14px', 
                lineHeight: '1.8',
                color: '#fff'
              }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  <code>
                    <span style={{ color: '#888' }}>// Studio-grade rendering</span><br/>
                    <span style={{ color: '#fff', fontWeight: 700 }}>snip</span> cli.js <span style={{ color: '#888' }}>--theme</span> tokyo-night
                  </code>
                </pre>
              </div>
            </div>
          </motion.div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--color-secondary)', marginBottom: '24px' }}>
              Boutique Output
            </div>
            <h2 style={{ fontSize: '56px', lineHeight: 0.9, marginBottom: '40px' }}>
              Precision <br/>By Design.
            </h2>
            <p style={{ fontSize: '18px', color: 'var(--color-secondary)', lineHeight: 1.6, marginBottom: '50px' }}>
              Engineered for technical clarity. Every shadow and border is crafted to make your work look professional in any context.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              {Object.keys(bgs).map(bgKey => (
                <motion.button 
                  key={bgKey}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setBackground(bgKey)}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '8px',
                    border: background === bgKey ? '2px solid white' : '1px solid rgba(255,255,255,0.1)',
                    background: bgs[bgKey],
                    cursor: 'pointer',
                    transition: 'border 0.2s'
                  }}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
