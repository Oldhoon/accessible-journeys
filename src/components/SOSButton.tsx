
import React, { useState } from 'react';
import { AlertTriangle, X, PhoneCall, MessageSquare, User } from 'lucide-react';
import { errorFeedback, buttonFeedback } from '@/utils/hapticFeedback';
import { cn } from '@/lib/utils';

interface SOSButtonProps {
  className?: string;
}

const SOSButton: React.FC<SOSButtonProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [countdown, setCountdown] = useState(5);
  
  const toggleSOS = () => {
    buttonFeedback();
    setIsOpen(!isOpen);
  };
  
  const startConfirmation = () => {
    errorFeedback();
    setIsConfirming(true);
    
    // Start countdown
    let count = 5;
    const timer = setInterval(() => {
      count -= 1;
      setCountdown(count);
      
      if (count <= 0) {
        clearInterval(timer);
        sendSOS();
      }
    }, 1000);
    
    // Store the timer to clear it if canceled
    return () => clearInterval(timer);
  };
  
  const cancelSOS = () => {
    buttonFeedback();
    setIsConfirming(false);
    setCountdown(5);
  };
  
  const sendSOS = () => {
    errorFeedback();
    console.log('SOS alert sent!');
    // In a real implementation, this would trigger the SOS alert
    // via Twilio SMS or Firebase Notifications
    
    // Close the SOS panel after sending
    setIsConfirming(false);
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={toggleSOS}
        className={cn(
          'fab bottom-16 right-4 bg-accessibility-red text-white p-3 rounded-full z-10 shadow-strong',
          className
        )}
        aria-label="SOS Emergency Button"
      >
        <AlertTriangle size={22} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-end justify-center animate-fade-in">
          <div className="glass-card w-full max-w-md mx-4 mb-24 p-4 animate-scale-in">
            {!isConfirming ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="text-accessibility-red" size={22} />
                    <h3 className="text-lg font-medium">Emergency Assistance</h3>
                  </div>
                  <button 
                    onClick={toggleSOS}
                    className="p-2 text-muted-foreground rounded-full hover:bg-muted"
                    aria-label="Close SOS panel"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <p className="text-muted-foreground mb-4">
                  Send an emergency alert with your current location to your emergency contacts.
                </p>
                
                <div className="space-y-2 mb-4">
                  <button className="w-full flex items-center gap-3 p-3 bg-accessibility-red text-white rounded-lg">
                    <PhoneCall size={18} />
                    <span>Call Emergency Services</span>
                  </button>
                  
                  <button 
                    onClick={startConfirmation}
                    className="w-full flex items-center gap-3 p-3 bg-accessibility-orange text-white rounded-lg"
                  >
                    <MessageSquare size={18} />
                    <span>Alert Emergency Contacts</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 p-3 bg-accessibility-blue text-white rounded-lg">
                    <User size={18} />
                    <span>Manage Emergency Contacts</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-2">
                <div className="w-16 h-16 rounded-full bg-accessibility-red text-white flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <AlertTriangle size={30} />
                </div>
                
                <h3 className="text-lg font-medium mb-2">Sending SOS Alert in</h3>
                <p className="text-3xl font-bold text-accessibility-red mb-4">{countdown}</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Your current location will be shared with your emergency contacts.
                </p>
                
                <button 
                  onClick={cancelSOS}
                  className="w-full p-3 bg-muted text-foreground font-medium rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SOSButton;
