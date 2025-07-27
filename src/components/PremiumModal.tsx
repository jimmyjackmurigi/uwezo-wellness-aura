import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Zap, TrendingUp, Shield } from 'lucide-react'

interface PremiumModalProps {
  trigger: React.ReactNode
  onUpgrade?: () => void
}

const PremiumModal = ({ trigger, onUpgrade }: PremiumModalProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const features = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Advanced Analytics",
      description: "30-day health history with trend analysis and predictions"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "AI Health Coach",
      description: "Personalized recommendations powered by advanced AI models"
    },
    {
      icon: <Crown className="w-5 h-5" />,
      title: "Premium Charts",
      description: "Beautiful visualizations with advanced chart types"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Priority Support",
      description: "24/7 customer support and priority feature requests"
    }
  ]

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "7-day health history",
        "Basic metrics tracking",
        "Simple charts",
        "Community support"
      ],
      popular: false
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "month",
      features: [
        "30-day health history",
        "Advanced AI recommendations",
        "Premium chart types",
        "Export data",
        "Priority support",
        "Custom health goals"
      ],
      popular: true
    },
    {
      name: "Premium Annual",
      price: "$99.99",
      period: "year",
      features: [
        "Everything in Premium",
        "2 months free",
        "Early access to features",
        "Personal health consultant",
        "Advanced integrations"
      ],
      popular: false
    }
  ]

  const handleUpgrade = (plan: string) => {
    // In a real app, this would integrate with payment processing
    console.log(`Upgrading to ${plan}`)
    setIsOpen(false)
    onUpgrade?.()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl flex items-center justify-center gap-2">
            <Crown className="w-6 h-6 text-premium" />
            Upgrade to Uwezo Premium
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8">
          {/* Features Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center">Unlock Premium Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="border border-premium/20 bg-gradient-to-br from-card to-premium/5">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="premium-icon mt-1">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center">Choose Your Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`relative ${
                    plan.popular 
                      ? 'premium-card border-2 border-premium' 
                      : 'health-card'
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 premium-badge">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold">
                      {plan.price}
                      <span className="text-sm text-muted-foreground font-normal">
                        /{plan.period}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-success shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'premium-gradient text-white' 
                          : plan.name === 'Free' 
                            ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                            : ''
                      }`}
                      disabled={plan.name === 'Free'}
                      onClick={() => handleUpgrade(plan.name)}
                    >
                      {plan.name === 'Free' ? 'Current Plan' : `Upgrade to ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                30-day money back guarantee
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PremiumModal