import type { ReactNode } from 'react';
import Navbar from './Navbar';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="container main-content">
        {children}
      </main>
      <style>{`
        .app-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .main-content {
          flex: 1;
          padding-top: 2rem;
          padding-bottom: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Layout;
