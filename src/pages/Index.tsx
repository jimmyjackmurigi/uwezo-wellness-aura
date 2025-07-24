// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
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
              <div className="w-8 h-8 bg-muted rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Heart Rate</p>
                <p className="text-2xl font-bold">72 BPM</p>
                <p className="text-xs text-green-600">Normal</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                ❤️
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blood Oxygen</p>
                <p className="text-2xl font-bold">98%</p>
                <p className="text-xs text-green-600">Excellent</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                🫁
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Activity</p>
                <p className="text-2xl font-bold">7,842</p>
                <p className="text-xs text-muted-foreground">steps today</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                👟
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Today's Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sleep Quality</span>
                <span className="text-sm font-medium">Good (7.5h)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Stress Level</span>
                <span className="text-sm font-medium">Low</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Hydration</span>
                <span className="text-sm font-medium">6/8 glasses</span>
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">AI Recommendations</h3>
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">💡 Consider a 10-minute walk to reach your daily goal</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">🥤 Remember to drink more water today</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">😴 Your sleep pattern is consistent - keep it up!</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
