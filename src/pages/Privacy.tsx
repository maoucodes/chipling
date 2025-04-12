
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from 'lucide-react';

const Privacy: FC = () => {
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
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-muted-foreground">Last updated: April 12, 2025</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            Welcome to Chipling ("we," "our," or "us"). We are committed to protecting your privacy and providing 
            you with a safe online experience. This Privacy Policy explains how we collect, use, disclose, and 
            safeguard your information when you use our application and services.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
          <p>
            We may collect information about you in various ways, including:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              <strong>Personal Information:</strong> When you register an account, we collect your email address 
              and other information you provide during the registration process.
            </li>
            <li>
              <strong>Usage Data:</strong> We collect information about how you use our application, including 
              your search queries, learning paths, and interaction with content.
            </li>
            <li>
              <strong>Device Information:</strong> We collect information about the device you use to access our 
              application, including your IP address, browser type, and operating system.
            </li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
          <p>
            We use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>To provide and maintain our application and services</li>
            <li>To personalize your experience and deliver content tailored to your interests</li>
            <li>To improve our application and services</li>
            <li>To communicate with you, including sending you updates and notifications</li>
            <li>To prevent and address technical issues</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">4. Disclosure of Your Information</h2>
          <p>
            We may share your information in the following situations:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>With service providers to monitor and analyze the use of our application</li>
            <li>To comply with legal obligations</li>
            <li>To protect and defend our rights or property</li>
            <li>To prevent or investigate possible wrongdoing in connection with the application</li>
            <li>With your consent or direction</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">5. Security of Your Information</h2>
          <p>
            We implement appropriate security measures to protect your information from unauthorized access,
            alteration, disclosure, or destruction. However, no method of transmission over the Internet or method
            of electronic storage is 100% secure.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">6. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting
            the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mt-2">
            Email: <a href="mailto:privacy@chipling.com" className="text-primary hover:underline">privacy@chipling.xyz</a>
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
            <a href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
