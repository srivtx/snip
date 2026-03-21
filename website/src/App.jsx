import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Terminal, Github, Command } from 'lucide-react';
import Home from './pages/Home';
import CommandDocs from './components/CommandDocs';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app" style={{ position: 'relative' }}>
        {/* ── BACKGROUND LAYERS (Locked at the bottom) ── */}
        <div className="texture-halftone" />
        <div className="texture-topo" />
        <div className="scanline" />

        {/* ── NAV (Transparent to show background grain) ── */}
        <nav style={{ 
          minHeight: '70px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '20px 60px'
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: '28px', height: '28px', background: '#fff', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Terminal size={16} color="#000" strokeWidth={3} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 900, letterSpacing: '-1px' }}>snip</span>
          </Link>

          <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '32px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
              <Link to="/" style={{ color: '#fff', textDecoration: 'none', opacity: 0.4 }}>Home</Link>
              <Link to="/docs" style={{ color: '#fff', textDecoration: 'none', opacity: 0.4 }}>Docs</Link>
              <a href="https://github.com/srivtx/snip" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', opacity: 0.4 }}><Github size={16} /></a>
            </div>
            <a href="https://www.npmjs.com/package/@srivtx/snip" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <button className="btn-studio" style={{ padding: '8px 16px', fontSize: '11px' }}>
                Get Snip
              </button>
            </a>
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
