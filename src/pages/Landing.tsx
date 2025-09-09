import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SunIcon, MoonIcon, Brain, Zap, Shield, Globe } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

const Landing: FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleGetStarted = async () => {
    if (!isAuthenticated) {
      try {
        await login();
      } catch (error) {
        console.error("Login failed:", error);
      }
    }
    navigate('/app');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 dark:from-background dark:to-background/80">
      {/* Navigation */}
      <nav className="container mx-auto px-container py-4 sm:py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 rounded-md p-1.5 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-bold text-xl">chipling</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {theme === 'dark' ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          {!isAuthenticated ? (
            <Button variant="outline" onClick={login} className="hidden sm:flex">Sign In</Button>
          ) : (
            <Button variant="outline" onClick={() => navigate('/app')} className="hidden sm:flex">Go to App</Button>
          )}
          <Button onClick={handleGetStarted}>Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-container py-16 sm:py-24 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 max-w-3xl">Deep Dive Into Knowledge with AI-Powered Learning</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mb-10">
          Explore any academic or research topic in a structured, progressively expanding format designed for deep understanding. 
          Powered by Unio's advanced LLM API at unio.chipling.xyz for intelligent content generation.
        </p>
        <Button 
          size="lg" 
          onClick={handleGetStarted} 
          className="px-8 py-6 text-lg rounded-full"
        >
          Start Exploring
        </Button>
      </div>

      {/* Features */}
      <div className="container mx-auto px-container py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Chipling?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            title="AI-Powered Content"
            description="Leveraging Unio's advanced LLM API at unio.chipling.xyz for intelligent, accurate content generation."
            icon={<Brain className="w-6 h-6" />}
          />
          <FeatureCard 
            title="Structured Learning"
            description="Topics are organized into modules and topics for progressive understanding."
            icon={<IconLayers />}
          />
          <FeatureCard 
            title="Track Progress"
            description="Keep track of your learning journey with automatic progress tracking."
            icon={<IconChart />}
          />
          <FeatureCard 
            title="Smart Recommendations"
            description="Get personalized recommendations for related topics to explore."
            icon={<IconBrain />}
          />
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-container py-16 bg-card/30 dark:bg-card/20 rounded-2xl">
        <h2 className="text-3xl font-bold mb-12 text-center">How Chipling Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <HowItWorksStep 
            step={1}
            title="Search Any Topic"
            description="Enter any academic or research topic you want to explore in depth."
          />
          <HowItWorksStep 
            step={2}
            title="AI Generates Structure"
            description="Our system powered by Unio's LLM API creates a structured learning path with modules and topics."
          />
          <HowItWorksStep 
            step={3}
            title="Learn & Progress"
            description="Dive into each topic with detailed explanations, examples, and track your progress."
          />
        </div>
      </div>

      {/* Unio Integration Section */}
      <div className="container mx-auto px-container py-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-6">Powered by Unio's Advanced LLM API</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Chipling leverages Unio's cutting-edge language model API at <code className="bg-muted px-2 py-1 rounded">unio.chipling.xyz</code> 
              to deliver accurate, comprehensive, and up-to-date educational content.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FeatureListItem 
                icon={<Zap className="w-5 h-5 text-primary" />}
                text="Lightning-fast content generation"
              />
              <FeatureListItem 
                icon={<Shield className="w-5 h-5 text-primary" />}
                text="Secure and reliable API infrastructure"
              />
              <FeatureListItem 
                icon={<Globe className="w-5 h-5 text-primary" />}
                text="Global accessibility and scalability"
              />
              <FeatureListItem 
                icon={<Brain className="w-5 h-5 text-primary" />}
                text="Advanced natural language understanding"
              />
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-primary/10 dark:bg-primary/20 rounded-2xl p-8 w-full max-w-md">
              <div className="bg-card dark:bg-background rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Unio API</h3>
                    <p className="text-xs text-muted-foreground">unio.chipling.xyz</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-muted/50 dark:bg-muted/20 rounded-lg p-3">
                    <p className="text-sm">API Response Time</p>
                    <p className="font-bold">~150ms</p>
                  </div>
                  <div className="bg-muted/50 dark:bg-muted/20 rounded-lg p-3">
                    <p className="text-sm">Content Accuracy</p>
                    <p className="font-bold">98.7%</p>
                  </div>
                  <div className="bg-muted/50 dark:bg-muted/20 rounded-lg p-3">
                    <p className="text-sm">Daily Requests</p>
                    <p className="font-bold">50,000+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-container py-16 sm:py-20">
        <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-8 md:p-12 flex flex-col items-center text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to expand your knowledge?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">
            Join thousands of learners who are discovering new topics and deepening their understanding every day with the power of AI.
          </p>
          <Button size="lg" onClick={handleGetStarted} className="rounded-full">
            Get Started for Free
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-container py-8 border-t border-border/50 mt-12 dark:border-border/30">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 rounded-md p-1 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm">© 2025 Chipling. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
            <a href="/refund" className="text-sm text-muted-foreground hover:text-primary transition-colors">Refund Policy</a>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="chipling-card-hover text-center bg-card dark:bg-card/70 p-6 rounded-xl">
      <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

interface HowItWorksStepProps {
  step: number;
  title: string;
  description: string;
}

const HowItWorksStep: FC<HowItWorksStepProps> = ({ step, title, description }) => {
  return (
    <div className="text-center">
      <div className="bg-primary/10 dark:bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-lg font-bold">{step}</span>
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

interface FeatureListItemProps {
  icon: React.ReactNode;
  text: string;
}

const FeatureListItem: FC<FeatureListItemProps> = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <span>{text}</span>
    </div>
  );
};

// Simple icons for feature cards
const IconLayers = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconChart = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconBrain = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default Landing;