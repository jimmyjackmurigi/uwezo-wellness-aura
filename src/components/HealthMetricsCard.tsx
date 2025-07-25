import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface HealthMetricsCardProps {
  title: string
  value: string | number
  unit?: string
  status: 'normal' | 'warning' | 'critical' | 'excellent'
  icon: string
  trend?: 'up' | 'down' | 'stable'
}

const HealthMetricsCard = ({
  title,
  value,
  unit,
  status,
  icon,
  trend
}: HealthMetricsCardProps) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'health-status-excellent'
      case 'normal':
        return 'health-status-normal'
      case 'warning':
        return 'health-status-warning'
      case 'critical':
        return 'health-status-critical'
      default:
        return ''
    }
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return '↗️'
      case 'down':
        return '↘️'
      case 'stable':
        return '→'
      default:
        return ''
    }
  }

  const getMetricIconClass = (status: string) => {
    const baseClass = 'metric-icon transition-all duration-300'
    if (status === 'critical') {
      return `${baseClass} pulse-animation`
    }
    return baseClass
  }

  return (
    <Card className="health-card animate-fade-in group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
            <div className="flex items-baseline space-x-2 mb-3">
              <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
              {unit && <span className="text-sm font-medium text-muted-foreground">{unit}</span>}
            </div>
            <div className="flex items-center space-x-3">
              <Badge 
                variant="secondary" 
                className={`${getStatusClass(status)} font-medium px-3 py-1 rounded-full text-xs`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
              {trend && (
                <div className="flex items-center space-x-1">
                  <span className="text-lg transition-transform group-hover:scale-110">{getTrendIcon(trend)}</span>
                </div>
              )}
            </div>
          </div>
          <div className={getMetricIconClass(status)}>
            <span className="transition-transform group-hover:scale-110">{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default HealthMetricsCard