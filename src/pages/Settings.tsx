
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, Crown, BadgeDollarSign, Info } from 'lucide-react';
import ChiplingLayout from '@/components/ChiplingLayout';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  
  // Mock data for daily request usage
  const dailyRequestLimit = 35;
  const usedRequests = 12; // this would come from a real tracking system
  const percentUsed = (usedRequests / dailyRequestLimit) * 100;

  const plans = [
    {
      name: 'Free',
      price: 0,
      features: [
        '35 requests per day',
        'Basic learning path',
        'Community support'
      ],
      current: user?.subscriptionType === 'free',
      color: 'bg-muted'
    },
    {
      name: 'Silver',
      price: 3,
      features: [
        'Unlimited requests',
        'Advanced learning paths',
        'Priority support'
      ],
      current: user?.subscriptionType === 'silver',
      color: 'bg-zinc-300'
    },
    {
      name: 'Gold',
      price: 7,
      features: [
        'Unlimited requests',
        'Custom learning paths',
        'Priority support',
        'Exclusive content'
      ],
      current: user?.subscriptionType === 'gold',
      color: 'bg-amber-300'
    }
  ];

  return (
    <ChiplingLayout>
      <div className="container max-w-4xl py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and subscription</p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>View and manage your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Email</h3>
                  <p>{user?.email}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Name</h3>
                  <p>{user?.displayName || 'Not set'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Current Plan</h3>
                  <div className="flex items-center gap-2">
                    <p className="capitalize">{user?.subscriptionType || 'Free'}</p>
                    {(user?.subscriptionType === 'silver' || user?.subscriptionType === 'gold') && (
                      <Badge variant="outline" className="bg-amber-100 text-amber-800">Premium</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {user?.subscriptionType === 'free' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Daily Request Usage
                    <Badge variant="outline">{usedRequests} / {dailyRequestLimit}</Badge>
                  </CardTitle>
                  <CardDescription>Your daily request limit resets every 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={percentUsed} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {dailyRequestLimit - usedRequests} requests remaining today
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveTab('subscription')}
                  >
                    Upgrade for unlimited requests
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="subscription" className="mt-6">
            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan, index) => (
                <Card key={index} className={`border ${plan.current ? 'border-primary' : ''}`}>
                  <CardHeader className={`${plan.color} bg-opacity-10`}>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        {plan.name}
                        {plan.name !== 'Free' && <Crown size={16} className="text-amber-500" />}
                      </CardTitle>
                      {plan.current && (
                        <Badge variant="outline" className="bg-primary/20">
                          Current
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-end gap-1">
                      {plan.price > 0 ? (
                        <>
                          <span className="text-2xl font-bold">${plan.price}</span>
                          <span className="text-muted-foreground">/month</span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold">Free</span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      disabled={plan.current}
                      variant={plan.current ? "outline" : "default"}
                    >
                      {plan.current ? 'Current Plan' : `Subscribe to ${plan.name}`}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg mt-6 flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-medium">About Subscription Plans</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Upgrade to Silver or Gold to unlock unlimited daily requests and access premium features.
                  All subscriptions are billed monthly and can be cancelled anytime.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ChiplingLayout>
  );
};

export default Settings;
