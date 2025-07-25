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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 health-gradient rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse-glow shadow-xl">
            <span className="text-3xl font-bold text-white">U</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Loading Uwezo</h2>
            <p className="text-muted-foreground">Preparing your health dashboard...</p>
          </div>
          <div className="mt-6 flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
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
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 health-gradient rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Uwezo
                </h1>
                <span className="text-xs text-muted-foreground">AI Health Companion</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <span className="text-sm text-muted-foreground">
                  Welcome, <span className="font-medium text-foreground">{user.user_metadata?.first_name || user.email}</span>!
                </span>
              </div>
              <Button variant="outline" onClick={signOut} className="hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-secondary/50 p-1 rounded-2xl mb-8">
            <TabsTrigger value="dashboard" className="rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="journal" className="rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Journal
            </TabsTrigger>
            <TabsTrigger value="metrics" className="rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Add Data
            </TabsTrigger>
            <TabsTrigger value="achievements" className="rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              AI Coach
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-2">Health Overview</h2>
              <p className="text-muted-foreground">Monitor your vital health metrics in real-time</p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <HealthMetricsCard
                title="Heart Rate"
                value={dashboardData.heartRate}
                unit="BPM"
                status="normal"
                icon="❤️"
                trend="stable"
              />
              <HealthMetricsCard
                title="Blood Oxygen"
                value={dashboardData.bloodOxygen}
                unit="%"
                status="excellent"
                icon="🫁"
              />
              <HealthMetricsCard
                title="Daily Steps"
                value={dashboardData.steps.toLocaleString()}
                status="normal"
                icon="👟"
                trend="up"
              />
              <HealthMetricsCard
                title="Sleep"
                value={dashboardData.sleepHours}
                unit="hours"
                status="normal"
                icon="😴"
              />
            </div>

            {/* AI Recommendations */}
            <div className="animate-scale-in">
              <AIRecommendations />
            </div>
          </TabsContent>

          <TabsContent value="journal" className="animate-fade-in">
            <HealthJournal />
          </TabsContent>

          <TabsContent value="metrics" className="animate-fade-in">
            <AddHealthMetric onMetricAdded={fetchLatestMetrics} />
          </TabsContent>

          <TabsContent value="achievements" className="animate-fade-in">
            <GameificationPanel />
          </TabsContent>

          <TabsContent value="recommendations" className="animate-fade-in">
            <AIRecommendations />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
