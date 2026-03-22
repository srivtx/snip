import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Terminal, Github, Command, Zap } from 'lucide-react';
import Home from './pages/Home';
import CommandDocs from './components/CommandDocs';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app" style={{ position: 'relative' }}>
        {/* ── BACKGROUND LAYERS (Locked at the bottom) ── */}
        <div className="texture-grain" />
        <div className="texture-halftone" />
        <div className="texture-topo" />
        <div className="scanline" />
        
        {/* ── NAV & BANNER (Fixed Header) ── */}
        <nav style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 100,
          background: 'rgba(3, 3, 3, 0.4)',
          backdropFilter: 'blur(30px)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* ── TOP BANNER ── */}
          <div style={{
            background: '#f8e71c',
            color: '#000',
            padding: '4px 16px',
            textAlign: 'center',
            fontSize: '9px',
            fontWeight: 900,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '6px',
            lineHeight: 1.3
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={9} fill="#000" /> Offline RAG v2.
            </div>
            <span>Semantic Intent & Auto-Execution.</span>
          </div>

          <div style={{
            minHeight: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px'
          }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: '22px', height: '22px', background: '#fff', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Terminal size={12} color="#000" strokeWidth={3} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 900, letterSpacing: '-1px' }}>snip</span>
          </Link>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              <Link to="/" style={{ color: '#fff', textDecoration: 'none', opacity: 0.4 }}>Home</Link>
              <Link to="/docs" style={{ color: '#fff', textDecoration: 'none', opacity: 0.4 }}>Docs</Link>
              <a href="https://github.com/srivtx/snip" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', opacity: 0.4 }}><Github size={14} /></a>
            </div>
            <a href="https://www.npmjs.com/package/@srivtx/snip" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <button className="btn-studio" style={{ padding: '6px 12px', fontSize: '10px' }}>
                Get Snip
              </button>
            </a>
          </div>
        </div>
      </nav>

        <main style={{ minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/docs" element={<CommandDocs />} />
          </Routes>
        </main>

        {/* ── FOOTER (Solid to cover background grain) ── */}
        <footer>
          <div className="container" style={{ display: 'flex', padding: '100px 0', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '20px', height: '20px', background: '#222', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Command size={12} color="#444" />
              </div>
              <span style={{ fontWeight: 900, fontSize: '16px', letterSpacing: '-1px', opacity: 0.4 }}>snip.engine_v1</span>
            </div>
            <p style={{ color: '#222', fontSize: '10px', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase' }}>
              © 2026 BOUTIQUE ENGINEERING TOOLKIT. HANDCRAFTED.
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App;
