import { Outlet, ScrollRestoration } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from '../ui/WhatsAppButton';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-20" id="main-content">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <ScrollRestoration />
    </div>
  );
}
