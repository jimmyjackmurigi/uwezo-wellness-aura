import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

interface AddHealthMetricProps {
  onMetricAdded: () => void
}

const AddHealthMetric = ({ onMetricAdded }: AddHealthMetricProps) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [metricType, setMetricType] = useState<string>('')
  const [value, setValue] = useState<string>('')

  const metricTypes = [
    { value: 'heart_rate', label: 'Heart Rate', unit: 'BPM' },
    { value: 'blood_oxygen', label: 'Blood Oxygen', unit: '%' },
    { value: 'blood_pressure_systolic', label: 'Blood Pressure (Systolic)', unit: 'mmHg' },
    { value: 'blood_pressure_diastolic', label: 'Blood Pressure (Diastolic)', unit: 'mmHg' },
    { value: 'temperature', label: 'Body Temperature', unit: '°C' },
    { value: 'weight', label: 'Weight', unit: 'kg' },
    { value: 'sleep_hours', label: 'Sleep Hours', unit: 'hours' },
    { value: 'stress_level', label: 'Stress Level', unit: '1-10' },
  ]

  const selectedMetric = metricTypes.find(m => m.value === metricType)

  const detectAnomaly = (type: string, val: number) => {
    const thresholds: Record<string, { min: number; max: number }> = {
      'heart_rate': { min: 60, max: 100 },
      'blood_oxygen': { min: 95, max: 100 },
      'blood_pressure_systolic': { min: 90, max: 140 },
      'blood_pressure_diastolic': { min: 60, max: 90 },
      'temperature': { min: 36.1, max: 37.5 },
      'stress_level': { min: 1, max: 7 },
    }

    const threshold = thresholds[type]
    if (!threshold) return false
    
    return val < threshold.min || val > threshold.max
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !metricType || !value) return

    setIsLoading(true)

    try {
      const numValue = parseFloat(value)
      const isAnomaly = detectAnomaly(metricType, numValue)

      const { error } = await supabase
        .from('health_metrics')
        .insert({
          user_id: user.id,
          metric_type: metricType,
          value: numValue,
          unit: selectedMetric?.unit || '',
          source: 'manual',
          is_anomaly: isAnomaly,
          anomaly_confidence: isAnomaly ? 0.8 : null,
        })

      if (error) throw error

      toast({
        title: "Health metric added!",
        description: `${selectedMetric?.label} recorded successfully.`,
      })

      // Reset form
      setMetricType('')
      setValue('')
      onMetricAdded()
    } catch (error) {
      toast({
        title: "Error adding metric",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Health Metric</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Metric Type</Label>
            <Select value={metricType} onValueChange={setMetricType}>
              <SelectTrigger>
                <SelectValue placeholder="Select a metric type" />
              </SelectTrigger>
              <SelectContent>
                {metricTypes.map((metric) => (
                  <SelectItem key={metric.value} value={metric.value}>
                    {metric.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedMetric && (
            <div className="space-y-2">
              <Label htmlFor="value">
                Value ({selectedMetric.unit})
              </Label>
              <Input
                id="value"
                type="number"
                step="0.1"
                placeholder={`Enter ${selectedMetric.label.toLowerCase()}`}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !metricType || !value}
          >
            {isLoading ? "Adding..." : "Add Metric"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default AddHealthMetric