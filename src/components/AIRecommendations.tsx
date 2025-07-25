import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'

interface Recommendation {
  id: string
  recommendation_type: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  is_read: boolean
  is_dismissed: boolean
  created_at: string
}

const AIRecommendations = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchRecommendations()
      generateSampleRecommendations()
    }
  }, [user])

  const fetchRecommendations = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_dismissed', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRecommendations(data?.map(item => ({
        ...item,
        priority: item.priority as 'low' | 'medium' | 'high' | 'urgent'
      })) || [])
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    }
  }

  const generateSampleRecommendations = async () => {
    if (!user) return

    try {
      // Check if user already has recommendations
      const { data: existing } = await supabase
        .from('ai_recommendations')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)

      if (existing && existing.length > 0) return

      // Generate sample recommendations
      const sampleRecommendations = [
        {
          user_id: user.id,
          recommendation_type: 'activity',
          title: 'Increase Daily Steps',
          description: 'Consider taking a 10-minute walk to reach your daily step goal. Walking helps improve cardiovascular health and boosts mood.',
          priority: 'medium',
        },
        {
          user_id: user.id,
          recommendation_type: 'nutrition',
          title: 'Stay Hydrated',
          description: 'You are behind on your daily water intake. Try to drink at least 2 more glasses of water today.',
          priority: 'high',
        },
        {
          user_id: user.id,
          recommendation_type: 'sleep',
          title: 'Maintain Sleep Schedule',
          description: 'Your sleep pattern has been consistent - keep it up! Try to maintain the same bedtime routine.',
          priority: 'low',
        },
        {
          user_id: user.id,
          recommendation_type: 'stress',
          title: 'Practice Mindfulness',
          description: 'Consider taking 5 minutes for deep breathing exercises to help manage stress levels.',
          priority: 'medium',
        },
      ]

      const { error } = await supabase
        .from('ai_recommendations')
        .insert(sampleRecommendations)

      if (error) throw error
      fetchRecommendations()
    } catch (error) {
      console.error('Error generating sample recommendations:', error)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ai_recommendations')
        .update({ is_read: true })
        .eq('id', id)

      if (error) throw error
      
      setRecommendations(prev => 
        prev.map(rec => rec.id === id ? { ...rec, is_read: true } : rec)
      )
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const dismissRecommendation = async (id: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('ai_recommendations')
        .update({ is_dismissed: true })
        .eq('id', id)

      if (error) throw error
      
      setRecommendations(prev => prev.filter(rec => rec.id !== id))
      
      toast({
        title: "Recommendation dismissed",
        description: "The recommendation has been removed.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to dismiss recommendation.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const markActionTaken = async (id: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('ai_recommendations')
        .update({ action_taken: true, is_read: true })
        .eq('id', id)

      if (error) throw error
      
      setRecommendations(prev => prev.filter(rec => rec.id !== id))
      
      toast({
        title: "Great job!",
        description: "Action completed successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update recommendation.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'activity':
        return '🏃‍♂️'
      case 'nutrition':
        return '🥗'
      case 'sleep':
        return '😴'
      case 'stress':
        return '🧘‍♂️'
      case 'medical':
        return '🩺'
      default:
        return '💡'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Health Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No new recommendations at this time.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Keep logging your health data to get personalized insights!
              </p>
            </div>
          ) : (
            recommendations.map((rec) => (
              <div
                key={rec.id}
                className={`p-4 border rounded-lg space-y-3 ${
                  rec.is_read ? 'bg-muted/30' : 'bg-background'
                }`}
                onClick={() => !rec.is_read && markAsRead(rec.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getTypeIcon(rec.recommendation_type)}</span>
                    <h4 className="font-semibold">{rec.title}</h4>
                    {!rec.is_read && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                  <Badge className={getPriorityColor(rec.priority)}>
                    {rec.priority}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {rec.description}
                </p>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      markActionTaken(rec.id)
                    }}
                    disabled={isLoading}
                  >
                    Done
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      dismissRecommendation(rec.id)
                    }}
                    disabled={isLoading}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default AIRecommendations