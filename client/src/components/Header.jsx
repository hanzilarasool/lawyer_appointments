import { Link, useLocation } from "wouter";
import { Scale } from "lucide-react";

export default function Header({ isAdmin, setIsAdmin }) {
  const [location, setLocation] = useLocation();

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
      setLocation("/");
    } else {
      setLocation("/admin");
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center cursor-pointer">
            <Scale className="text-law-blue text-2xl mr-3" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Manuel De Santiago</h1>
              <p className="text-xs sm:text-sm text-law-slate">Law Group</p>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            {!isAdmin ? (
              <button
                onClick={handleAdminToggle}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-primary bg-blue-50 border border-primary rounded-lg hover:bg-blue-100 transition-colors"
              >
                <i className="fas fa-user-shield mr-2"></i>Admin Portal
              </button>
            ) : (
              <button
                onClick={handleAdminToggle}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-black-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <i className="fas fa-calendar-plus mr-2"></i>Book Appointment
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}