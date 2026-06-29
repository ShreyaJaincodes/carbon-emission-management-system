import { BarChart3, Target, Lightbulb, TrendingUp, Factory, Recycle, Leaf, Sun } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-blue-50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-gray-900">Achieve Your </span>
              <span className="text-emerald-600">Sustainability Goals </span>
              <span className="text-gray-900">with Our </span>
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Integrated Platform
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Intelligent Solutions for a Green Planet
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Calculate Your Footprint
              </button>
              <button className="bg-white hover:bg-gray-50 text-emerald-600 border-2 border-emerald-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105">
                Explore Our Solutions
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Total Emission Calculation"
            description="Understand your current carbon footprint with precision."
          />
          <FeatureCard
            icon={<Target className="w-8 h-8" />}
            title="Total Sink Estimation"
            description="Measure natural carbon sequestration capabilities."
          />
          <FeatureCard
            icon={<Lightbulb className="w-8 h-8" />}
            title="Gap Analysis"
            description="Identify areas for improvement and intervention."
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Cleaner Technology Suggestions"
            description="Receive tailored recommendations for sustainable practices."
          />
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Comprehensive Waste Management</h2>
            <p className="text-xl text-emerald-100">Supporting Atmanirbhar Bharat & Swachh Bharat Mission</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <WasteCard
              icon={<Factory className="w-6 h-6" />}
              title="Overburden Management"
              description="Bioreclamation with native species"
            />
            <WasteCard
              icon={<Recycle className="w-6 h-6" />}
              title="Organic Waste to Energy"
              description="Biogas production & electricity generation"
            />
            <WasteCard
              icon={<Leaf className="w-6 h-6" />}
              title="Inorganic Waste Tracking"
              description="Metal, plastic, and glass recycling"
            />
            <WasteCard
              icon={<Sun className="w-6 h-6" />}
              title="Coal Rejects to Energy"
              description="FBC technology for power generation"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Achieve Carbon Neutrality?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join coal mines across Barmer and Dhanbad in the journey towards a sustainable future.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started Today
          </button>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg mb-2">EcoNovo Tech - Promoting Atmanirbhar Bharat in Sustainable Mining</p>
          <p className="text-gray-400">A Step Towards Carbon Neutral Indian Coal Sector</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all hover:scale-105">
      <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4 mx-auto">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{title}</h3>
      <p className="text-gray-600 text-center leading-relaxed">{description}</p>
    </div>
  );
}

function WasteCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all">
      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-white mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-emerald-100 text-sm">{description}</p>
    </div>
  );
}
