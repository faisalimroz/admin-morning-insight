import React from 'react'
import {
  // useDailyInspiration,
  // useCurrencyRates,
  useWeatherData
} from '@/hooks/useWidgets'
import { useInsightCategoryCounts, useContentList } from '@/hooks/useContent'
import { useUsersList } from '@/hooks/useUsers'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/Card'
import {
  Quote,
  TrendingUp,
  CloudSun,
  CloudRain,
  Sun,
  Wind,
  Layers,
  FileText,
  Newspaper,
  Users as UsersIcon,
  RefreshCw,
  TrendingDown
} from 'lucide-react'

export function Dashboard() {
  const [selectedCity, setSelectedCity] = React.useState('New York')

  // Queries (Daily Inspiration and Currency Rates API calls commented out due to auth redirect issues)
  // const { data: quote, isLoading: isQuoteLoading, refetch: refetchQuote } = useDailyInspiration()
  // const { data: rates, isLoading: isRatesLoading, refetch: refetchRates } = useCurrencyRates()
  const quote = { quote: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" }
  const isQuoteLoading = false
  const refetchQuote = () => { }

  const rates = { rates: { EUR: 0.92, GBP: 0.78, JPY: 154.5, CAD: 1.37 } }
  const isRatesLoading = false
  const refetchRates = () => { }

  const { data: weather, isLoading: isWeatherLoading } = useWeatherData(selectedCity)
  const { data: categories, isLoading: isCategoriesLoading } = useInsightCategoryCounts()

  const { data: news } = useContentList('news')
  const { data: trending } = useContentList('trending-news')
  const { data: breaking } = useContentList('breaking-news')
  const { data: tenders } = useContentList('tenders')
  const { data: users } = useUsersList()
  // 1. Get the unwrapped list of users
  const userList = Array.isArray(users)
    ? users
    : (users as any)?.items || (users as any)?.data?.items || []

  // 2. Get the total count from pagination metadata or fallback to array length
  const totalCount = (users as any)?.pagination?.total || (users as any)?.data?.pagination?.total || userList.length
  const totalNews = (news?.length || 0) + (trending?.length || 0) + (breaking?.length || 0)

  // Weather Code Mapper
  const getWeatherInfo = (code?: number) => {
    if (code === undefined) return { label: 'Clear Sky', icon: Sun, color: 'text-amber-400' }
    if (code === 0) return { label: 'Clear Sky', icon: Sun, color: 'text-amber-400' }
    if (code >= 1 && code <= 3) return { label: 'Partly Cloudy', icon: CloudSun, color: 'text-gray-400' }
    if (code >= 51 && code <= 67) return { label: 'Drizzle', icon: CloudRain, color: 'text-blue-400' }
    if (code >= 71 && code <= 82) return { label: 'Rainy', icon: CloudRain, color: 'text-blue-500' }
    return { label: 'Overcast', icon: CloudSun, color: 'text-slate-400' }
  }

  const weatherInfo = getWeatherInfo(weather?.weathercode)
  const WeatherIcon = weatherInfo.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to the MorningInsight administrative control center.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNews}</div>
            <p className="text-xs text-muted-foreground mt-0.5">News, Trending & Breaking</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Tenders</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenders?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Procurement opportunities</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Insights Categories</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Unique insights sectors</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">System Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Admins & clients registered</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Widgets Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Daily Inspiration */}
        <Card className="flex flex-col justify-between overflow-hidden relative bg-gradient-to-br from-card to-muted/20">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <Quote className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">Daily Inspiration</CardTitle>
            </div>
            <button
              onClick={() => refetchQuote()}
              className="p-1.5 hover:bg-secondary rounded-lg transition-colors cursor-pointer"
              title="Refresh Quote"
            >
              <RefreshCw className={`h-4 w-4 text-muted-foreground ${isQuoteLoading ? 'animate-spin' : ''}`} />
            </button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center py-4">
            {isQuoteLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 bg-muted rounded-md w-full"></div>
                <div className="h-4 bg-muted rounded-md w-5/6"></div>
                <div className="h-3 bg-muted rounded-md w-1/3 mt-4"></div>
              </div>
            ) : (
              <blockquote className="space-y-3">
                <p className="text-md italic font-medium leading-relaxed text-foreground/90">
                  "{quote?.quote}"
                </p>
                <footer className="text-sm text-muted-foreground font-semibold">
                  — {quote?.author || 'Unknown'}
                </footer>
              </blockquote>
            )}
          </CardContent>
        </Card>

        {/* Currency Rates */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <CardTitle className="text-base font-semibold">Exchange Rates (USD)</CardTitle>
            </div>
            <button
              onClick={() => refetchRates()}
              className="p-1.5 hover:bg-secondary rounded-lg transition-colors cursor-pointer"
              title="Refresh Exchange Rates"
            >
              <RefreshCw className={`h-4 w-4 text-muted-foreground ${isRatesLoading ? 'animate-spin' : ''}`} />
            </button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            {isRatesLoading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-muted rounded-md w-12"></div>
                    <div className="h-4 bg-muted rounded-md w-16"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {rates?.rates &&
                  Object.entries(rates.rates).map(([currency, rate]) => (
                    <div key={currency} className="flex items-center justify-between py-2 text-sm first:pt-0 last:pb-0">
                      <span className="font-semibold text-muted-foreground">{currency}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-medium">{rate.toFixed(2)}</span>
                        {rate > 1 ? (
                          <TrendingUp className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-rose-400" />
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weather Card */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloudSun className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-base font-semibold">Local Weather</CardTitle>
              </div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="text-xs bg-secondary border border-border rounded-md px-2 py-1 focus:outline-none font-medium"
              >
                <option value="New York">New York</option>
                <option value="London">London</option>
                <option value="Tokyo">Tokyo</option>
                <option value="Paris">Paris</option>
                <option value="Sydney">Sydney</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            {isWeatherLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-muted rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-6 bg-muted rounded-md w-16"></div>
                    <div className="h-4 bg-muted rounded-md w-24"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center p-3 rounded-2xl bg-secondary">
                    <WeatherIcon className={`h-10 w-10 ${weatherInfo.color}`} />
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold tracking-tighter">
                      {weather?.temperature?.toFixed(1)}°C
                    </div>
                    <div className="text-sm font-semibold text-muted-foreground capitalize mt-0.5">
                      {weatherInfo.label} in {selectedCity}
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-semibold justify-end">
                    <Wind className="h-3 w-3" /> Wind
                  </div>
                  <div className="font-mono text-sm font-semibold">{weather?.windspeed} km/h</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category counts and visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Insights Distribution by Sector</CardTitle>
          <CardDescription>
            Number of published insight articles mapped across categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isCategoriesLoading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-4 bg-muted rounded-md w-24"></div>
                  <div className="h-6 bg-muted rounded-md w-full"></div>
                </div>
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="space-y-4">
              {categories.map((cat, idx) => {
                const maxCount = Math.max(...categories.map((c) => c.count), 1)
                const percentage = (cat.count / maxCount) * 100
                const colors = [
                  'bg-indigo-500',
                  'bg-sky-500',
                  'bg-teal-500',
                  'bg-violet-500',
                  'bg-emerald-500',
                ]
                const color = colors[idx % colors.length]

                return (
                  <div key={cat.category || idx} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold capitalize text-foreground/90">
                        {cat.category || 'General'}
                      </span>
                      <span className="font-mono font-bold text-muted-foreground">
                        {cat.count} articles
                      </span>
                    </div>
                    <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${color}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Layers className="h-10 w-10 text-muted-foreground opacity-50 mb-2" />
              <p className="text-sm text-muted-foreground">No insights categories data found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
