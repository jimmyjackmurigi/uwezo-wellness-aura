import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Brain, Sparkles } from 'lucide-react'
import PremiumModal from './PremiumModal'

interface HealthInsight {
  id: string
  type: 'positive' | 'warning' | 'improvement' | 'achievement'
  title: string
  description: string
  recommendation?: string
  isPremium?: boolean
}

interface HealthInsightsProps {
  healthData: {
    heartRate: number
    bloodOxygen: number
    steps: number
    sleepHours: number
  }
  isPremium?: boolean
}

const HealthInsights = ({ healthData, isPremium = false }: HealthInsightsProps) => {
  const [insights, setInsights] = useState<HealthInsight[]>([])

  useEffect(() => {
    generateInsights()
  }, [healthData, isPremium])

  const generateInsights = () => {
    const newInsights: HealthInsight[] = []

    // Heart Rate Analysis
    if (healthData.heartRate < 60) {
      newInsights.push({
        id: 'hr-low',
        type: 'warning',
        title: 'Low Resting Heart Rate',
        description: `Your heart rate (${healthData.heartRate} BPM) is below average.`,
        recommendation: 'Consider consulting with a healthcare provider if this is unusual for you.'
      })
    } else if (healthData.heartRate > 100) {
      newInsights.push({
        id: 'hr-high',
        type: 'warning',
        title: 'Elevated Heart Rate',
        description: `Your heart rate (${healthData.heartRate} BPM) is above normal range.`,
        recommendation: 'Try relaxation techniques and monitor your stress levels.'
      })
    } else {
      newInsights.push({
        id: 'hr-good',
        type: 'positive',
        title: 'Healthy Heart Rate',
        description: `Your heart rate (${healthData.heartRate} BPM) is in the optimal range.`,
        recommendation: 'Keep up your current activity level!'
      })
    }

    // Blood Oxygen Analysis
    if (healthData.bloodOxygen >= 98) {
      newInsights.push({
        id: 'spo2-excellent',
        type: 'achievement',
        title: 'Excellent Oxygen Levels',
        description: `Outstanding blood oxygen at ${healthData.bloodOxygen}%.`,
        recommendation: 'Your respiratory health is excellent!'
      })
    } else if (healthData.bloodOxygen < 95) {
      newInsights.push({
        id: 'spo2-low',
        type: 'warning',
        title: 'Low Blood Oxygen',
        description: `Blood oxygen (${healthData.bloodOxygen}%) is below optimal.`,
        recommendation: 'Consider breathing exercises and consult a healthcare provider if persistent.'
      })
    }

    // Steps Analysis
    if (healthData.steps >= 10000) {
      newInsights.push({
        id: 'steps-goal',
        type: 'achievement',
        title: 'Daily Step Goal Achieved!',
        description: `Amazing! You've walked ${healthData.steps.toLocaleString()} steps today.`,
        recommendation: 'You\'re crushing your fitness goals!'
      })
    } else if (healthData.steps < 5000) {
      newInsights.push({
        id: 'steps-low',
        type: 'improvement',
        title: 'Increase Daily Activity',
        description: `You've taken ${healthData.steps.toLocaleString()} steps today.`,
        recommendation: 'Try to add a 10-minute walk to boost your activity level.'
      })
    }

    // Sleep Analysis
    if (healthData.sleepHours >= 7 && healthData.sleepHours <= 9) {
      newInsights.push({
        id: 'sleep-optimal',
        type: 'positive',
        title: 'Optimal Sleep Duration',
        description: `Great job getting ${healthData.sleepHours} hours of sleep!`,
        recommendation: 'Perfect sleep duration for optimal health and recovery.'
      })
    } else if (healthData.sleepHours < 6) {
      newInsights.push({
        id: 'sleep-short',
        type: 'warning',
        title: 'Insufficient Sleep',
        description: `Only ${healthData.sleepHours} hours of sleep may impact your health.`,
        recommendation: 'Aim for 7-9 hours for better recovery and mental clarity.'
      })
    } else if (healthData.sleepHours > 10) {
      newInsights.push({
        id: 'sleep-long',
        type: 'improvement',
        title: 'Extended Sleep Duration',
        description: `${healthData.sleepHours} hours might be more than needed.`,
        recommendation: 'Consider establishing a consistent sleep schedule.'
      })
    }

    // Premium AI Insights
    if (isPremium) {
      newInsights.push({
        id: 'ai-trend',
        type: 'positive',
        title: 'AI Health Trend Analysis',
        description: 'Based on your 30-day history, your overall health score has improved by 12%.',
        recommendation: 'Your consistency in tracking is paying off! Keep it up.',
        isPremium: true
      })

      newInsights.push({
        id: 'ai-prediction',
        type: 'improvement',
        title: 'Predictive Health Insight',
        description: 'AI predicts optimal workout time for you is between 6-8 AM based on your biorhythms.',
        recommendation: 'Try morning workouts for maximum energy and results.',
        isPremium: true
      })
    } else {
      // Add locked premium insights for free users
      newInsights.push({
        id: 'ai-locked-1',
        type: 'positive',
        title: 'AI Trend Analysis',
        description: 'Get detailed health trends and predictions with Premium.',
        isPremium: true
      })

      newInsights.push({
        id: 'ai-locked-2',
        type: 'improvement',
        title: 'Personalized Recommendations',
        description: 'Unlock AI-powered personalized health coaching.',
        isPremium: true
      })
    }

    setInsights(newInsights)
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="w-5 h-5 text-success" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />
      case 'improvement':
        return <TrendingUp className="w-5 h-5 text-primary" />
      case 'achievement':
        return <Sparkles className="w-5 h-5 text-premium" />
      default:
        return <Brain className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getInsightBadge = (type: string) => {
    switch (type) {
      case 'positive':
        return <Badge variant="outline" className="health-status-excellent">Great</Badge>
      case 'warning':
        return <Badge variant="outline" className="health-status-warning">Attention</Badge>
      case 'improvement':
        return <Badge variant="outline" className="health-status-normal">Improve</Badge>
      case 'achievement':
        return <Badge className="premium-badge">Achievement</Badge>
      default:
        return null
    }
  }

  return (
    <Card className="health-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Health Insights
          {isPremium && <Badge className="premium-badge">AI Enhanced</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.id} className="relative">
            {insight.isPremium && !isPremium && (
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/90 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                <PremiumModal
                  trigger={
                    <Button variant="outline" size="sm" className="gap-2">
                      <Sparkles className="w-4 h-4" />
                      Unlock Premium Insights
                    </Button>
                  }
                />
              </div>
            )}
            
            <div className={`p-4 rounded-lg border ${
              insight.isPremium && !isPremium ? 'opacity-50' : ''
            } ${
              insight.type === 'achievement' 
                ? 'bg-gradient-to-r from-premium/5 to-premium/10 border-premium/20' 
                : 'bg-muted/30 border-border'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getInsightIcon(insight.type)}
                  <h4 className="font-semibold text-sm">{insight.title}</h4>
                  {insight.isPremium && isPremium && (
                    <Badge variant="outline" className="premium-badge text-xs">AI</Badge>
                  )}
                </div>
                {getInsightBadge(insight.type)}
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">
                {insight.description}
              </p>
              
              {insight.recommendation && (isPremium || !insight.isPremium) && (
                <p className="text-xs text-primary font-medium">
                  💡 {insight.recommendation}
                </p>
              )}
            </div>
          </div>
        ))}
        
        {!isPremium && (
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              Get more personalized insights with Premium
            </p>
            <PremiumModal
              trigger={
                <Button size="sm" className="premium-gradient text-white">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Upgrade for AI Insights
                </Button>
              }
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default HealthInsights