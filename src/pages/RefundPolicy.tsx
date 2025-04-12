import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from 'lucide-react';

const RefundPolicy: FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-white/10 rounded-md p-1.5 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span 
            className="font-semibold text-xl cursor-pointer" 
            onClick={() => navigate('/')}
          >
            chipling
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1"
        >
          <ChevronLeftIcon size={16} />
          Back
        </Button>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl animate-in fade-in duration-500">
        <h1 className="text-3xl font-bold mb-6">Refund and Cancellation Policy</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-muted-foreground">Last updated: April 12, 2025</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">1. No Refund Policy</h2>
          <p>
            At Chipling, we maintain a strict no-refund policy for all purchases made through our platform. 
            Once a purchase is completed, we do not offer refunds under any circumstances. This policy is 
            in place to ensure the quality and integrity of our services.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">2. Subscription Cancellation</h2>
          <p>
            While we do not provide refunds, you may cancel your subscription at any time before your next 
            billing cycle. Here's what you need to know about cancellation:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              Your subscription will remain active until the end of your current billing period
            </li>
            <li>
              You will continue to have access to all features until the end of your paid period
            </li>
            <li>
              No partial refunds will be issued for unused time in your current billing period
            </li>
            <li>
              Cancellation will take effect at the end of your current billing cycle
            </li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">3. How to Cancel Your Subscription</h2>
          <p>
            To cancel your subscription:
          </p>
          <ol className="list-decimal pl-6 mt-2 space-y-2">
            <li>Log into your Chipling account</li>
            <li>Navigate to Account Settings</li>
            <li>Select 'Subscription'</li>
            <li>Click on 'Cancel Subscription'</li>
            <li>Follow the prompts to confirm your cancellation</li>
          </ol>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">4. Exceptions</h2>
          <p>
            While we maintain a strict no-refund policy, we may consider exceptions in cases of:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Technical issues preventing access to our services</li>
            <li>Unauthorized charges</li>
            <li>Service unavailability due to our system maintenance</li>
          </ul>
          <p className="mt-4">
            Such cases will be reviewed on an individual basis and any decisions made will be at the sole 
            discretion of Chipling.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about our Refund and Cancellation Policy, please contact us at:
          </p>
          <p className="mt-2">
            Email: <a href="mailto:support@chipling.xyz" className="text-primary hover:underline">meet.sonawane2015@gmail.com</a>
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border/50 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="bg-white/10 rounded-md p-1 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm">© 2025 Chipling. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</a>
            <a href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</a>
            <a href="/refund-policy" className="text-sm text-muted-foreground hover:text-primary">Refund Policy</a>
            <a href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RefundPolicy;