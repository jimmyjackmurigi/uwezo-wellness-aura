import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'

interface JournalEntry {
  id: string
  date: string
  mood_rating: number | null
  mood_emoji: string | null
  energy_level: number | null
  sleep_quality: number | null
  symptoms: string[] | null
  notes: string | null
}

const HealthJournal = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Form state
  const [moodRating, setMoodRating] = useState<number>(5)
  const [moodEmoji, setMoodEmoji] = useState<string>('😊')
  const [energyLevel, setEnergyLevel] = useState<number>(5)
  const [sleepQuality, setSleepQuality] = useState<number>(5)
  const [symptoms, setSymptoms] = useState<string>('')
  const [notes, setNotes] = useState<string>('')

  const moodEmojis = ['😢', '😟', '😐', '🙂', '😊', '😄', '😁', '🤩', '😍', '🥳']

  useEffect(() => {
    if (user) {
      fetchEntries()
    }
  }, [user])

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('health_journal')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false })
        .limit(5)

      if (error) throw error
      setEntries(data || [])
    } catch (error) {
      console.error('Error fetching journal entries:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)

    try {
      const symptomArray = symptoms.split(',').map(s => s.trim()).filter(s => s.length > 0)
      
      const { error } = await supabase
        .from('health_journal')
        .upsert({
          user_id: user.id,
          date: new Date().toISOString().split('T')[0],
          mood_rating: moodRating,
          mood_emoji: moodEmoji,
          energy_level: energyLevel,
          sleep_quality: sleepQuality,
          symptoms: symptomArray.length > 0 ? symptomArray : null,
          notes: notes || null,
        })

      if (error) throw error

      toast({
        title: "Journal entry saved!",
        description: "Your health data has been recorded.",
      })

      // Reset form
      setMoodRating(5)
      setMoodEmoji('😊')
      setEnergyLevel(5)
      setSleepQuality(5)
      setSymptoms('')
      setNotes('')

      // Refresh entries
      fetchEntries()
    } catch (error) {
      toast({
        title: "Error saving entry",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Today's Health Journal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mood Rating */}
            <div className="space-y-3">
              <Label>Mood (1-10)</Label>
              <div className="flex items-center space-x-4">
                <Input
                  type="range"
                  min="1"
                  max="10"
                  value={moodRating}
                  onChange={(e) => {
                    const value = parseInt(e.target.value)
                    setMoodRating(value)
                    setMoodEmoji(moodEmojis[value - 1])
                  }}
                  className="flex-1"
                />
                <span className="text-2xl">{moodEmoji}</span>
                <span className="text-sm font-medium w-8">{moodRating}</span>
              </div>
            </div>

            {/* Energy Level */}
            <div className="space-y-3">
              <Label>Energy Level (1-10)</Label>
              <div className="flex items-center space-x-4">
                <Input
                  type="range"
                  min="1"
                  max="10"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-8">{energyLevel}</span>
              </div>
            </div>

            {/* Sleep Quality */}
            <div className="space-y-3">
              <Label>Sleep Quality (1-10)</Label>
              <div className="flex items-center space-x-4">
                <Input
                  type="range"
                  min="1"
                  max="10"
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-8">{sleepQuality}</span>
              </div>
            </div>

            {/* Symptoms */}
            <div className="space-y-2">
              <Label htmlFor="symptoms">Symptoms (comma-separated)</Label>
              <Input
                id="symptoms"
                placeholder="headache, fatigue, nausea"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="How are you feeling today? Any observations about your health?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Entry"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      {entries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="border-l-4 border-primary pl-4 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{new Date(entry.date).toLocaleDateString()}</span>
                    <span className="text-2xl">{entry.mood_emoji}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="outline">Mood: {entry.mood_rating}/10</Badge>
                    <Badge variant="outline">Energy: {entry.energy_level}/10</Badge>
                    <Badge variant="outline">Sleep: {entry.sleep_quality}/10</Badge>
                  </div>
                  {entry.symptoms && entry.symptoms.length > 0 && (
                    <div className="text-sm text-muted-foreground mb-1">
                      Symptoms: {entry.symptoms.join(', ')}
                    </div>
                  )}
                  {entry.notes && (
                    <p className="text-sm text-muted-foreground">{entry.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default HealthJournal