import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Shield } from 'lucide-react';
import { Home } from './pages/Home';
import { Browse } from './pages/Browse';
import { AppDetail } from './pages/AppDetail';
import { Terms } from './pages/Terms';
import { WalletButton } from './components/shared/WalletButton';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      retry: 1,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-base-primary">
                  <Shield size={32} />
                  BaseReview
                </Link>

                <nav className="flex items-center gap-6">
                  <Link to="/" className="text-gray-700 hover:text-base-primary font-medium">
                    Home
                  </Link>
                  <Link to="/browse" className="text-gray-700 hover:text-base-primary font-medium">
                    Browse
                  </Link>
                  <WalletButton />
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/app/:appId" element={<AppDetail />} />
              <Route path="/terms" element={<Terms />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-base-secondary text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="grid grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center gap-2 text-xl font-bold mb-4">
                    <Shield size={24} />
                    BaseReview
                  </div>
                  <p className="text-sm text-gray-300">
                    Community watchdog for Base MiniApps. Protecting users from scams.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold mb-4">Platform</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link to="/browse" className="text-gray-300 hover:text-white">
                        Browse Apps
                      </Link>
                    </li>
                    <li>
                      <a href="#" className="text-gray-300 hover:text-white">
                        How It Works
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-300 hover:text-white">
                        FAQ
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mb-4">Community</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="#" className="text-gray-300 hover:text-white">
                        Discord
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-300 hover:text-white">
                        Twitter
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-300 hover:text-white">
                        GitHub
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mb-4">Legal</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link to="/terms" className="text-gray-300 hover:text-white">
                        Terms of Use & Disclaimer
                      </Link>
                    </li>
                    <li>
                      <a href="#" className="text-gray-300 hover:text-white">
                        Privacy Policy
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
                © 2024 BaseReview. Built on Base. Powered by the community.
              </div>
            </div>
          </footer>
          </div>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
