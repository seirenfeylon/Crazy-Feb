import { lazy, Suspense, useEffect, useState } from 'react';
import { StoreProvider, useStore } from './store';
import { AuthProvider, useAuth } from './lib/authContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';
import Footer from './components/Footer';
import FloatingWidgets from './components/FloatingWidgets';
import LuxuryLoader from './components/LuxuryLoader';
import { HomepageRenderer } from './components/homepage/HomepageRenderer';
import { Marquee } from './components/HomeSections';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import { AboutPage } from './pages/AboutPage';
import { AccountPage } from './pages/AccountPage';
import { CollectionPage } from './pages/CollectionPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ContactPage } from './pages/ContactPage';
import { RecentlyViewed } from './pages/RecentlyViewed';
import { TrackPage } from './pages/TrackPage';
import { WishlistPage } from './pages/WishlistPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProtectedRoute } from './pages/ProtectedRoute';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';

const AdminPage = lazy(() => import('./pages/admin/AdminPage').then(m => ({ default: m.AdminPage })));

function HomePage() {
  const { siteSettings } = useStore();
  return (
    <>
      <Marquee />
      <HomepageRenderer
        sections={siteSettings.homepageBuilder?.sections}
        siteSettings={siteSettings}
      />
      <RecentlyViewed />
    </>
  );
}

function Router() {
  const { route } = useStore();
  switch (route.name) {
    case 'home': return <HomePage />;
    case 'shop': return <ShopPage initialCategory={route.category} initialGender={route.gender} />;
    case 'new-arrivals': return <ShopPage onlyNew={true} />;
    case 'product': return <ProductPage id={route.id} />;
    case 'collections': return <CollectionsPage />;
    case 'collection': return <CollectionPage id={route.id} />;
    case 'about': return <AboutPage />;
    case 'contact': return <ContactPage />;
    case 'checkout': return <CheckoutPage />;
    case 'account': return <AccountPage />;
    case 'wishlist': return <WishlistPage />;
    case 'track': return <TrackPage />;
    case 'signin': return <SignInPage />;
    case 'signup': return <SignUpPage />;
    case 'forgot': return <ForgotPasswordPage />;
    case 'profile': return <ProtectedRoute><ProfilePage /></ProtectedRoute>;
    default: return <HomePage />;
  }
}

function Shell() {
  const { route, globalLoading, globalLoadingMessage } = useStore();
  const { ready: authReady } = useAuth();
  const [initialInit, setInitialInit] = useState(true);

  useEffect(() => {
    if (authReady) {
      const timer = setTimeout(() => {
        setInitialInit(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [authReady]);

  const showGlobalLoader = !authReady || initialInit || globalLoading;

  if (route.name === 'admin') {
    return (
      <div className="min-h-screen bg-ink-50 dark:bg-ink-900 text-ink-900 dark:text-white">
        <LuxuryLoader show={showGlobalLoader} message={globalLoadingMessage} />
        <main key={`admin-${route.section ?? 'dashboard'}`} className="animate-fade-in">
          <Suspense fallback={<LuxuryLoader show={true} message="Loading admin workspace..." />}>
            <AdminPage section={route.section} />
          </Suspense>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-900 text-ink-900 dark:text-white">
      <LuxuryLoader show={showGlobalLoader} message={globalLoadingMessage} />
      <Navbar />
      <main key={route.name} className="animate-fade-in">
        <Router />
      </main>
      <Footer />
      <CartDrawer />
      <SearchModal />
      <FloatingWidgets />
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </StoreProvider>
  );
}

export default App;
