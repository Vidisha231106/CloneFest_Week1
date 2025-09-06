// src/components/Layout.jsx
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <main className="flex-grow w-full pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;