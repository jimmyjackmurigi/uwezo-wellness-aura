import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, TrendingUp, Shield, Zap, Heart } from 'lucide-react'
import PremiumModal from './PremiumModal'

interface GuestWelcomeProps {
  onGetStarted: () => void
}

const GuestWelcome = ({ onGetStarted }: GuestWelcomeProps) => {
  const [showDemo, setShowDemo] = useState(false)

  const features = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Health Monitoring",
      description: "Track heart rate, blood oxygen, sleep, and daily activities"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Smart Analytics",
      description: "AI-powered insights and personalized health recommendations"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Gamification",
      description: "Earn points and achievements for maintaining healthy habits"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Privacy First",
      description: "Your health data is encrypted and completely private"
    }
  ]

  if (showDemo) {
    onGetStarted()
    return null
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
      <div className="text-center space-y-4 max-w-2xl">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 health-gradient rounded-3xl flex items-center justify-center shadow-xl animate-pulse-glow">
            <span className="text-3xl font-bold text-white">U</span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Welcome to Uwezo
        </h1>
        
        <p className="text-xl text-muted-foreground">
          Your AI-powered health companion for a better, healthier life
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button 
            size="lg" 
            className="health-gradient text-white font-semibold px-8 py-3 text-lg"
            onClick={() => setShowDemo(true)}
          >
            Try Demo
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <PremiumModal
            trigger={
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 text-lg"
              >
                View Premium Features
              </Button>
            }
          />
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className="health-card interactive-card animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="text-center">
              <div className="metric-icon mx-auto mb-2">
                {feature.icon}
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <div className="flex flex-wrap justify-center gap-8 text-center">
        <div className="space-y-1">
          <div className="text-2xl font-bold text-primary">10K+</div>
          <div className="text-sm text-muted-foreground">Active Users</div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-primary">1M+</div>
          <div className="text-sm text-muted-foreground">Health Records</div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-primary">99.9%</div>
          <div className="text-sm text-muted-foreground">Uptime</div>
        </div>
      </div>

      {/* Call to Action */}
      <Card className="max-w-md w-full text-center premium-card">
        <CardContent className="p-6 space-y-4">
          <Badge className="premium-badge">Limited Time</Badge>
          <h3 className="text-lg font-semibold">Start Your Health Journey</h3>
          <p className="text-sm text-muted-foreground">
            Join thousands of users who have transformed their health with Uwezo
          </p>
          <Button 
            className="w-full health-gradient text-white"
            onClick={() => setShowDemo(true)}
          >
            Get Started Now - It's Free!
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default GuestWelcome