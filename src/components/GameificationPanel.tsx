import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: string
  points: number
  earned_at?: string
}

interface UserPoints {
  points: number
  total_points: number
  level_number: number
}

const GameificationPanel = () => {
  const { user } = useAuth()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null)
  const [earnedAchievements, setEarnedAchievements] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (user) {
      fetchAchievements()
      fetchUserPoints()
      fetchUserAchievements()
    }
  }, [user])

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('points', { ascending: true })

      if (error) throw error
      setAchievements(data || [])
    } catch (error) {
      console.error('Error fetching achievements:', error)
    }
  }

  const fetchUserPoints = async () => {
    try {
      const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (error) throw error
      setUserPoints(data)
    } catch (error) {
      console.error('Error fetching user points:', error)
    }
  }

  const fetchUserAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('achievement_id, earned_at')
        .eq('user_id', user?.id)

      if (error) throw error
      setEarnedAchievements(new Set(data?.map(a => a.achievement_id) || []))
    } catch (error) {
      console.error('Error fetching user achievements:', error)
    }
  }

  const getLevelProgress = () => {
    if (!userPoints) return 0
    const pointsNeededForNextLevel = userPoints.level_number * 100
    const pointsInCurrentLevel = userPoints.total_points % 100
    return (pointsInCurrentLevel / pointsNeededForNextLevel) * 100
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'activity':
        return 'bg-blue-100 text-blue-800'
      case 'consistency':
        return 'bg-green-100 text-green-800'
      case 'health_improvement':
        return 'bg-purple-100 text-purple-800'
      case 'milestone':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* User Level and Points */}
      {userPoints && (
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Level {userPoints.level_number}</h3>
                  <p className="text-sm text-muted-foreground">
                    {userPoints.total_points} total points earned
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">{userPoints.points} pts</p>
                  <p className="text-sm text-muted-foreground">available</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Level {userPoints.level_number + 1}</span>
                  <span>{Math.round(getLevelProgress())}%</span>
                </div>
                <Progress value={getLevelProgress()} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => {
              const isEarned = earnedAchievements.has(achievement.id)
              
              return (
                <div
                  key={achievement.id}
                  className={`p-4 border rounded-lg transition-all ${
                    isEarned 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted bg-muted/30 opacity-70'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{achievement.name}</h4>
                        {isEarned && <span className="text-green-600">✓</span>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="secondary" 
                          className={getCategoryColor(achievement.category)}
                        >
                          {achievement.category.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm font-medium">
                          {achievement.points} pts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GameificationPanel