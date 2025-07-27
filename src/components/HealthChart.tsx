import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'

interface ChartDataPoint {
  date: string
  heartRate?: number
  bloodOxygen?: number
  sleepHours?: number
  steps?: number
}

interface HealthChartProps {
  isPremium?: boolean
}

const HealthChart = ({ isPremium = false }: HealthChartProps) => {
  const { user } = useAuth()
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [selectedMetric, setSelectedMetric] = useState<'heartRate' | 'bloodOxygen' | 'sleepHours' | 'steps'>('heartRate')
  const [loading, setLoading] = useState(true)

  const metrics = [
    { key: 'heartRate' as const, label: 'Heart Rate', color: '#059669', unit: 'BPM' },
    { key: 'bloodOxygen' as const, label: 'Blood Oxygen', color: '#3B82F6', unit: '%' },
    { key: 'sleepHours' as const, label: 'Sleep Hours', color: '#8B5CF6', unit: 'hrs' },
    { key: 'steps' as const, label: 'Daily Steps', color: '#F59E0B', unit: 'steps' }
  ]

  useEffect(() => {
    if (user) {
      fetchChartData()
    } else {
      // Generate demo data for guest users
      generateDemoData()
    }
  }, [user])

  const fetchChartData = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      
      // Fetch health metrics
      const { data: healthMetrics } = await supabase
        .from('health_metrics')
        .select('metric_type, value, recorded_at')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: true })
        .limit(isPremium ? 30 : 7) // Premium users get 30 days, free users get 7 days

      // Fetch daily activities
      const { data: activities } = await supabase
        .from('daily_activities')
        .select('steps, date')
        .eq('user_id', user.id)
        .order('date', { ascending: true })
        .limit(isPremium ? 30 : 7)

      // Process and combine data
      const processedData: { [key: string]: ChartDataPoint } = {}

      // Process health metrics
      healthMetrics?.forEach(metric => {
        const date = new Date(metric.recorded_at).toLocaleDateString()
        if (!processedData[date]) {
          processedData[date] = { date }
        }
        
        if (metric.metric_type === 'heart_rate') {
          processedData[date].heartRate = metric.value
        } else if (metric.metric_type === 'blood_oxygen') {
          processedData[date].bloodOxygen = metric.value
        } else if (metric.metric_type === 'sleep_hours') {
          processedData[date].sleepHours = metric.value
        }
      })

      // Process activities
      activities?.forEach(activity => {
        const date = new Date(activity.date).toLocaleDateString()
        if (!processedData[date]) {
          processedData[date] = { date }
        }
        processedData[date].steps = activity.steps
      })

      setChartData(Object.values(processedData))
    } catch (error) {
      console.error('Error fetching chart data:', error)
      generateDemoData()
    } finally {
      setLoading(false)
    }
  }

  const generateDemoData = () => {
    const demoData: ChartDataPoint[] = []
    const days = isPremium ? 30 : 7
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      demoData.push({
        date: date.toLocaleDateString(),
        heartRate: 70 + Math.random() * 20,
        bloodOxygen: 95 + Math.random() * 5,
        sleepHours: 6 + Math.random() * 3,
        steps: 5000 + Math.random() * 5000
      })
    }
    
    setChartData(demoData)
    setLoading(false)
  }

  const selectedMetricData = metrics.find(m => m.key === selectedMetric)!

  if (loading) {
    return (
      <Card className="health-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Health Trends
            {isPremium && <Badge className="premium-badge">PRO</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={isPremium ? "premium-card" : "health-card"}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Health Trends
          {isPremium && <Badge className="premium-badge">PRO</Badge>}
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          {metrics.map((metric) => (
            <Button
              key={metric.key}
              variant={selectedMetric === metric.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMetric(metric.key)}
              className="text-xs"
            >
              {metric.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {isPremium ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={selectedMetricData.color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={selectedMetricData.color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={selectedMetricData.color}
                  strokeWidth={2}
                  fill="url(#colorGradient)"
                />
              </AreaChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={selectedMetricData.color}
                  strokeWidth={2}
                  dot={{ fill: selectedMetricData.color, strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            {user ? 'Your personal health data' : 'Demo data - Sign in to track your real metrics'}
            {!isPremium && (
              <span className="block mt-1">
                <Badge variant="outline" className="text-xs">
                  Upgrade to PRO for 30-day history and advanced charts
                </Badge>
              </span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default HealthChart