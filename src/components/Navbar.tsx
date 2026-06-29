import { Leaf } from 'lucide-react';

interface NavbarProps {
  onNavigate?: (page: string) => void;
}

export function Navbar({ onNavigate }: NavbarProps) {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate?.('home')}>
            <Leaf className="w-8 h-8 text-emerald-600" />
            <span className="text-2xl font-bold text-gray-900">EcoNovo</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => onNavigate?.('home')} className="text-gray-700 hover:text-emerald-600 transition-colors">
              Home
            </button>
            <button onClick={() => onNavigate?.('solutions')} className="text-gray-700 hover:text-emerald-600 transition-colors">
              Solutions
            </button>
            <button onClick={() => onNavigate?.('carbon-credits')} className="text-gray-700 hover:text-emerald-600 transition-colors">
              Carbon Credits
            </button>
            <button onClick={() => onNavigate?.('about')} className="text-gray-700 hover:text-emerald-600 transition-colors">
              About Us
            </button>
            <button onClick={() => onNavigate?.('contact')} className="text-gray-700 hover:text-emerald-600 transition-colors">
              Contact
            </button>
          </div>

          <button
            onClick={() => onNavigate?.('login')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
