
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from 'lucide-react';

const Terms: FC = () => {
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
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-muted-foreground">Last updated: April 12, 2025</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Chipling's application and services ("Services"), you agree to be bound by these 
            Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, 
            you are prohibited from using or accessing our Services.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">2. Use License</h2>
          <p>
            Permission is granted to temporarily use our Services for personal, non-commercial purposes only. 
            This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to decompile or reverse engineer any software contained in our Services</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
          <p className="mt-4">
            This license shall automatically terminate if you violate any of these restrictions and may be 
            terminated by Chipling at any time.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">3. User Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current 
            at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate 
            termination of your account.
          </p>
          <p className="mt-2">
            You are responsible for safeguarding the password that you use to access our Services and for any 
            activities or actions under your password.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">4. Content</h2>
          <p>
            Our Services allow you to post, link, store, share and otherwise make available certain information, 
            text, graphics, or other material. You are responsible for the content that you post to our Services, 
            including its legality, reliability, and appropriateness.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">5. Intellectual Property</h2>
          <p>
            The Services and their original content, features, and functionality are and will remain the exclusive 
            property of Chipling and its licensors. The Services are protected by copyright, trademark, and other 
            laws of both the United States and foreign countries.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">6. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason 
            whatsoever, including without limitation if you breach the Terms.
          </p>
          <p className="mt-2">
            Upon termination, your right to use our Services will immediately cease. If you wish to terminate your 
            account, you may simply discontinue using our Services.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
          <p>
            In no event shall Chipling, nor its directors, employees, partners, agents, suppliers, or affiliates, 
            be liable for any indirect, incidental, special, consequential or punitive damages, including without 
            limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access 
            to or use of or inability to access or use the Services.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">8. Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision 
            is material we will try to provide at least 30 days' notice prior to any new terms taking effect.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">9. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="mt-2">
            Email: <a href="mailto:terms@chipling.xyz" className="text-primary hover:underline">terms@chipling.xyz</a>
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
            <a href="/refund" className="text-sm text-muted-foreground hover:text-primary">Refund Policy</a>
            <a href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Terms;
