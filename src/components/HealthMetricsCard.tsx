import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface HealthMetricsCardProps {
  title: string
  value: string | number
  unit?: string
  status: 'normal' | 'warning' | 'critical' | 'excellent'
  icon: string
  trend?: 'up' | 'down' | 'stable'
  backgroundColor?: string
}

const HealthMetricsCard = ({
  title,
  value,
  unit,
  status,
  icon,
  trend,
  backgroundColor = 'bg-muted'
}: HealthMetricsCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600'
      case 'normal':
        return 'text-green-600'
      case 'warning':
        return 'text-yellow-600'
      case 'critical':
        return 'text-red-600'
      default:
        return 'text-muted-foreground'
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

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-baseline space-x-1">
              <p className="text-2xl font-bold">{value}</p>
              {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary" className={getStatusColor(status)}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
              {trend && (
                <span className="text-sm">{getTrendIcon(trend)}</span>
              )}
            </div>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${backgroundColor}`}>
            <span className="text-2xl">{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default HealthMetricsCard