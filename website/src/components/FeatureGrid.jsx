import React from 'react';
import { motion } from 'framer-motion';
import {
  Code, Share2, Wand2, Video, FileDiff, Palette, Smartphone, Search, QrCode
} from 'lucide-react';

const features = [
  { icon: Code, title: 'Snippets', desc: 'Syntax highlighting with auto-detection.' },
  { icon: Share2, title: 'OG Images', desc: 'Social metadata asset generation.' },
  { icon: Wand2, title: 'AI Removal', desc: 'Local background matting engine.' },
  { icon: Video, title: 'Motion', desc: 'Cinematic code scroll animations.' },
  { icon: FileDiff, title: 'Diffing', desc: 'Visual code comparison images.' },
  { icon: Palette, title: 'Color', desc: 'Hex analysis and palette extraction.' },
  { icon: Smartphone, title: 'Mockups', desc: 'MacOS & Browser window frames.' },
  { icon: Search, title: 'OCR', desc: 'Local image-to-text processing.' },
  { icon: QrCode, title: 'Utility', desc: 'QR and SVG transformation tools.' },
];

export default function FeatureGrid() {
  return (
    <section id="features" style={{ padding: '120px 0', borderTop: '1px solid var(--color-border)' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1px',
          background: 'var(--color-border)',
          border: '1px solid var(--color-border)'
        }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ background: 'rgba(255,255,255,0.02)' }}
              style={{
                padding: '50px 40px',
                background: 'var(--color-bg)',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              <f.icon size={20} strokeWidth={2.5} color="#fff" style={{ opacity: 0.5 }} />
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>{f.title}</h3>
                <p style={{ color: 'var(--color-secondary)', fontSize: '14px', lineHeight: '1.5' }}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
