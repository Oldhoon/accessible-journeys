
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  MapPin, 
  Map, 
  UserPlus, 
  VolumeX, 
  Volume2, 
  Moon, 
  Sun,
  Vibrate,
  HelpCircle,
  FileText,
  Lock
} from 'lucide-react';
import AppNavigation from '@/components/navigation/AppNavigation';
import { buttonFeedback } from '@/utils/hapticFeedback';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [voiceGuidance, setVoiceGuidance] = useState(true);
  
  const handleBack = () => {
    buttonFeedback();
    navigate(-1);
  };
  
  const handleSetting = (
    setting: 'notifications' | 'location' | 'darkMode' | 'hapticFeedback' | 'voiceGuidance', 
    value: boolean
  ) => {
    buttonFeedback();
    
    switch (setting) {
      case 'notifications':
        setNotifications(value);
        break;
      case 'location':
        setLocation(value);
        break;
      case 'darkMode':
        setDarkMode(value);
        break;
      case 'hapticFeedback':
        setHapticFeedback(value);
        break;
      case 'voiceGuidance':
        setVoiceGuidance(value);
        break;
    }
    
    toast({
      title: "Setting Updated",
      description: `${setting.charAt(0).toUpperCase() + setting.slice(1)} is now ${value ? 'enabled' : 'disabled'}`,
      duration: 2000,
    });
  };
  
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border/50">
        <div className="flex items-center px-4 h-14">
          <button 
            onClick={handleBack}
            className="p-2 -ml-2 text-foreground button-animation"
            aria-label="Go back"
          >
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-lg font-medium ml-2">Settings</h1>
        </div>
      </header>
      
      <main className="px-4 py-4">
        {/* App Settings */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">App Settings</h2>
          
          <div className="space-y-1 rounded-lg border border-border overflow-hidden">
            {/* Notifications */}
            <div className="flex items-center justify-between p-3 bg-card">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-accessibility-blue" />
                <span>Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications}
                  onChange={() => handleSetting('notifications', !notifications)}
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accessibility-blue"></div>
              </label>
            </div>
            
            {/* Location */}
            <div className="flex items-center justify-between p-3 bg-card">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-accessibility-blue" />
                <span>Location Services</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={location}
                  onChange={() => handleSetting('location', !location)}
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accessibility-blue"></div>
              </label>
            </div>
            
            {/* Dark Mode */}
            <div className="flex items-center justify-between p-3 bg-card">
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon size={18} className="text-accessibility-blue" />
                ) : (
                  <Sun size={18} className="text-accessibility-blue" />
                )}
                <span>Dark Mode</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={darkMode}
                  onChange={() => handleSetting('darkMode', !darkMode)}
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accessibility-blue"></div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Map Settings */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Map Settings</h2>
          
          <div className="space-y-1 rounded-lg border border-border overflow-hidden">
            {/* Default Map View */}
            <button className="w-full flex items-center justify-between p-3 bg-card text-left button-animation">
              <div className="flex items-center gap-3">
                <Map size={18} className="text-accessibility-blue" />
                <span>Default Map View</span>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>
        
        {/* Accessibility Settings */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Accessibility Settings</h2>
          
          <div className="space-y-1 rounded-lg border border-border overflow-hidden">
            {/* Haptic Feedback */}
            <div className="flex items-center justify-between p-3 bg-card">
              <div className="flex items-center gap-3">
                <Vibrate size={18} className="text-accessibility-blue" />
                <span>Haptic Feedback</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={hapticFeedback}
                  onChange={() => handleSetting('hapticFeedback', !hapticFeedback)}
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accessibility-blue"></div>
              </label>
            </div>
            
            {/* Voice Guidance */}
            <div className="flex items-center justify-between p-3 bg-card">
              <div className="flex items-center gap-3">
                {voiceGuidance ? (
                  <Volume2 size={18} className="text-accessibility-blue" />
                ) : (
                  <VolumeX size={18} className="text-accessibility-blue" />
                )}
                <span>Voice Guidance</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={voiceGuidance}
                  onChange={() => handleSetting('voiceGuidance', !voiceGuidance)}
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accessibility-blue"></div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Account Settings */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Account</h2>
          
          <div className="space-y-1 rounded-lg border border-border overflow-hidden">
            {/* Emergency Contacts */}
            <button className="w-full flex items-center justify-between p-3 bg-card text-left button-animation">
              <div className="flex items-center gap-3">
                <UserPlus size={18} className="text-accessibility-blue" />
                <span>Emergency Contacts</span>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </button>
            
            {/* Privacy */}
            <button className="w-full flex items-center justify-between p-3 bg-card text-left button-animation">
              <div className="flex items-center gap-3">
                <Lock size={18} className="text-accessibility-blue" />
                <span>Privacy & Security</span>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>
        
        {/* Help & Support */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Help & Support</h2>
          
          <div className="space-y-1 rounded-lg border border-border overflow-hidden">
            {/* Help Center */}
            <button className="w-full flex items-center justify-between p-3 bg-card text-left button-animation">
              <div className="flex items-center gap-3">
                <HelpCircle size={18} className="text-accessibility-blue" />
                <span>Help Center</span>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </button>
            
            {/* Terms & Privacy */}
            <button className="w-full flex items-center justify-between p-3 bg-card text-left button-animation">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-accessibility-blue" />
                <span>Terms & Privacy Policy</span>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Inclusive Accessibility Navigator v1.0.0
          </p>
        </div>
      </main>
      
      <AppNavigation />
    </div>
  );
};

export default SettingsPage;
