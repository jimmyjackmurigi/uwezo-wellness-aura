import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import HealthMetricsCard from '@/components/HealthMetricsCard'
import HealthJournal from '@/components/HealthJournal'
import AddHealthMetric from '@/components/AddHealthMetric'
import GameificationPanel from '@/components/GameificationPanel'
import AIRecommendations from '@/components/AIRecommendations'

interface DashboardData {
  heartRate: number
  bloodOxygen: number
  steps: number
  sleepHours: number
}

const Index = () => {
  const { user, signOut, loading } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    heartRate: 72,
    bloodOxygen: 98,
    steps: 7842,
    sleepHours: 7.5
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl font-bold text-primary-foreground">U</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  const fetchLatestMetrics = async () => {
    try {
      const { data: metrics } = await supabase
        .from('health_metrics')
        .select('metric_type, value')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })

      if (metrics) {
        const latestMetrics: Record<string, number> = {}
        metrics.forEach(metric => {
          if (!latestMetrics[metric.metric_type]) {
            latestMetrics[metric.metric_type] = metric.value
          }
        })

        setDashboardData(prev => ({
          ...prev,
          heartRate: latestMetrics.heart_rate || prev.heartRate,
          bloodOxygen: latestMetrics.blood_oxygen || prev.bloodOxygen,
          sleepHours: latestMetrics.sleep_hours || prev.sleepHours,
        }))
      }

      // Fetch latest daily activity
      const { data: activity } = await supabase
        .from('daily_activities')
        .select('steps')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(1)
        .single()

      if (activity) {
        setDashboardData(prev => ({
          ...prev,
          steps: activity.steps || prev.steps
        }))
      }
    } catch (error) {
      console.error('Error fetching metrics:', error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchLatestMetrics()
    }
  }, [user])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">U</span>
              </div>
              <h1 className="text-xl font-bold">Uwezo</h1>
              <span className="text-sm text-muted-foreground">AI Health Companion</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.user_metadata?.first_name || user.email}!
              </span>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="journal">Journal</TabsTrigger>
            <TabsTrigger value="metrics">Add Data</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="recommendations">AI Coach</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <HealthMetricsCard
                title="Heart Rate"
                value={dashboardData.heartRate}
                unit="BPM"
                status="normal"
                icon="❤️"
                backgroundColor="bg-red-100"
                trend="stable"
              />
              <HealthMetricsCard
                title="Blood Oxygen"
                value={dashboardData.bloodOxygen}
                unit="%"
                status="excellent"
                icon="🫁"
                backgroundColor="bg-blue-100"
              />
              <HealthMetricsCard
                title="Daily Steps"
                value={dashboardData.steps.toLocaleString()}
                status="normal"
                icon="👟"
                backgroundColor="bg-green-100"
                trend="up"
              />
              <HealthMetricsCard
                title="Sleep"
                value={dashboardData.sleepHours}
                unit="hours"
                status="normal"
                icon="😴"
                backgroundColor="bg-purple-100"
              />
            </div>

            {/* AI Recommendations */}
            <AIRecommendations />
          </TabsContent>

          <TabsContent value="journal">
            <HealthJournal />
          </TabsContent>

          <TabsContent value="metrics">
            <AddHealthMetric onMetricAdded={fetchLatestMetrics} />
          </TabsContent>

          <TabsContent value="achievements">
            <GameificationPanel />
          </TabsContent>

          <TabsContent value="recommendations">
            <AIRecommendations />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
