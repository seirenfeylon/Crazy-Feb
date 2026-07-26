import { StoreProvider, useStore } from './store';
import { AuthProvider } from './lib/authContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';
import Footer from './components/Footer';
import FloatingWidgets from './components/FloatingWidgets';
import {
  CustomerReviews,
  FeaturedCollections,
  FlashSale,
  InstagramFeed,
  LimitedEditionBanner,
  Marquee,
  Newsletter,
  PremiumCategories,
  ProductRow,
} from './components/HomeSections';
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
import { AdminPage } from './pages/admin/AdminPage';

function HomePage() {
  const { siteSettings } = useStore();
  return (
    <>
      <Marquee />
      <FeaturedCollections />
      {siteSettings.flagShowBrands && <PremiumCategories />}
      <ProductRow id="new-arrivals" eyebrow="Just landed" title={siteSettings.newArrivalTitle || "New Arrivals"} subtitle="The latest additions to the CrazyFeb wardrobe." filter={(p) => p.tags.includes('new')} cta={{ label: 'Shop all', route: { name: 'shop' } }} />
      <ProductRow id="best-sellers" eyebrow="Client favorites" title={siteSettings.bestSellerTitle || "Best Sellers"} subtitle="The pieces our customers return to again and again." filter={(p) => p.tags.includes('bestseller')} cta={{ label: 'Shop all', route: { name: 'shop' } }} />
      <ProductRow id="trending" eyebrow="Loved this week" title={siteSettings.featuredSectionTitle || "Featured Products"} filter={(p) => p.tags.includes('trending')} cta={{ label: 'Shop all', route: { name: 'shop' } }} />
      <LimitedEditionBanner />
      {siteSettings.flagShowTestimonials && <CustomerReviews />}
      <FlashSale />
      {siteSettings.flagShowNewsletter && <Newsletter />}
      {siteSettings.flagShowInstagramFeed && <InstagramFeed />}
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
  const { route } = useStore();

  if (route.name === 'admin') {
    return (
      <div className="min-h-screen bg-ink-50 dark:bg-ink-900 text-ink-900 dark:text-white">
        <main key={`admin-${route.section ?? 'dashboard'}`} className="animate-fade-in">
          <AdminPage section={route.section} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-900 text-ink-900 dark:text-white">
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
