import { User, Building2, Building, Users } from 'lucide-react';
import type { UserRole } from '../types';

interface LoginSelectionProps {
  onSelectRole: (role: UserRole) => void;
}

export function LoginSelection({ onSelectRole }: LoginSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Welcome to EcoNovo</h1>
          <p className="text-xl text-gray-600">Select your role to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <RoleCard
            icon={<User className="w-12 h-12" />}
            title="Manager"
            description="Register mines and manage carbon data"
            onClick={() => onSelectRole('manager')}
            gradient="from-emerald-500 to-emerald-600"
          />
          <RoleCard
            icon={<Building2 className="w-12 h-12" />}
            title="Mine Owner"
            description="View comprehensive mine analytics"
            onClick={() => onSelectRole('owner')}
            gradient="from-blue-500 to-blue-600"
          />
          <RoleCard
            icon={<Building className="w-12 h-12" />}
            title="Government"
            description="Monitor district-wide sustainability"
            onClick={() => onSelectRole('government')}
            gradient="from-amber-500 to-amber-600"
          />
          <RoleCard
            icon={<Users className="w-12 h-12" />}
            title="Public User"
            description="Access transparency data"
            onClick={() => onSelectRole('user')}
            gradient="from-violet-500 to-violet-600"
          />
        </div>
      </div>
    </div>
  );
}

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  gradient: string;
}

function RoleCard({ icon, title, description, onClick, gradient }: RoleCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border border-gray-200 text-left"
    >
      <div className={`w-20 h-20 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white mb-6`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </button>
  );
}
