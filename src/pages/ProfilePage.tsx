
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Award, MapPin, Star, AlignLeft, Image, Settings, LogOut } from 'lucide-react';
import AppNavigation from '@/components/navigation/AppNavigation';
import { buttonFeedback } from '@/utils/hapticFeedback';
import { cn } from '@/lib/utils';

const ProfilePage = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    buttonFeedback();
    navigate(-1);
  };
  
  // Mock user data
  const user = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    contributions: 27,
    level: 'Gold Contributor',
    joinDate: 'January 2023',
    recentReports: [
      {
        id: '1',
        locationName: 'Central Park',
        rating: 4,
        date: '2 days ago'
      },
      {
        id: '2',
        locationName: 'Public Library',
        rating: 5,
        date: '1 week ago'
      },
      {
        id: '3',
        locationName: 'Community Center',
        rating: 3,
        date: '2 weeks ago'
      }
    ]
  };
  
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border/50">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center">
            <button 
              onClick={handleBack}
              className="p-2 -ml-2 text-foreground button-animation"
              aria-label="Go back"
            >
              <ChevronLeft size={22} />
            </button>
            <h1 className="text-lg font-medium ml-2">Profile</h1>
          </div>
          <button 
            onClick={() => navigate('/settings')}
            className="p-2 text-foreground button-animation"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>
      
      <main className="px-4 py-4">
        {/* User info */}
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-accessibility-blue text-white rounded-full flex items-center justify-center mr-4">
            <User size={28} />
          </div>
          <div>
            <h2 className="font-medium text-lg">{user.name}</h2>
            <p className="text-muted-foreground text-sm">{user.email}</p>
            <div className="flex items-center mt-1">
              <Award size={14} className="text-accessibility-yellow mr-1" />
              <span className="text-xs">{user.level}</span>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card p-4 rounded-lg border border-border shadow-subtle">
            <h3 className="text-xs text-muted-foreground uppercase mb-1">Contributions</h3>
            <p className="text-2xl font-medium">{user.contributions}</p>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border shadow-subtle">
            <h3 className="text-xs text-muted-foreground uppercase mb-1">Member Since</h3>
            <p className="text-md font-medium">{user.joinDate}</p>
          </div>
        </div>
        
        {/* Recent reports */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Recent Reports</h3>
          
          <div className="space-y-3">
            {user.recentReports.map((report) => (
              <div 
                key={report.id}
                className="p-3 bg-card rounded-lg border border-border shadow-subtle"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center">
                    <MapPin size={14} className="text-accessibility-blue mr-1 flex-shrink-0" />
                    <h4 className="font-medium text-sm">{report.locationName}</h4>
                  </div>
                  <div className="flex items-center gap-0.5 text-accessibility-yellow">
                    <Star size={12} className="fill-current" />
                    <span className="text-xs">{report.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{report.date}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Actions */}
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 p-3 bg-card rounded-lg border border-border shadow-subtle button-animation">
            <MapPin size={18} className="text-accessibility-blue" />
            <span>My Saved Places</span>
          </button>
          
          <button className="w-full flex items-center gap-3 p-3 bg-card rounded-lg border border-border shadow-subtle button-animation">
            <AlignLeft size={18} className="text-accessibility-blue" />
            <span>All My Reports</span>
          </button>
          
          <button className="w-full flex items-center gap-3 p-3 bg-card rounded-lg border border-border shadow-subtle button-animation">
            <Image size={18} className="text-accessibility-blue" />
            <span>My Photos</span>
          </button>
          
          <button className="w-full flex items-center gap-3 p-3 bg-destructive text-destructive-foreground rounded-lg mt-6 button-animation">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </main>
      
      <AppNavigation />
    </div>
  );
};

export default ProfilePage;
