import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { apiClient } from '@/api/client'

export interface QuoteData {
  quote: string
  author: string
}

export interface CurrencyRates {
  base: string
  date: string
  rates: Record<string, number>
}

export function useDailyInspiration() {
  return useQuery<QuoteData>({
    queryKey: ['daily-inspiration'],
    queryFn: async () => {
      const response = await apiClient.get('/daily-inspiration')
      return response.data?.data || response.data || { quote: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" }
    },
    retry: 1,
  })
}

export function useCurrencyRates() {
  return useQuery<CurrencyRates>({
    queryKey: ['currency-rates'],
    queryFn: async () => {
      const response = await apiClient.get('/currency/daily-rate')
      return response.data?.data || response.data || {
        base: 'USD',
        date: new Date().toISOString().split('T')[0],
        rates: { EUR: 0.92, GBP: 0.78, JPY: 154.5, CAD: 1.37, AUD: 1.51 }
      }
    },
    retry: 1,
  })
}

export interface WeatherData {
  temperature: number
  windspeed: number
  weathercode: number
  time: string
}

export function useWeatherData(city = 'New York') {
  const cityCoordinates: Record<string, { lat: number; lon: number }> = {
    'New York': { lat: 40.7128, lon: -74.0060 },
    'London': { lat: 51.5074, lon: -0.1278 },
    'Tokyo': { lat: 35.6762, lon: 139.6503 },
    'Paris': { lat: 48.8566, lon: 2.3522 },
    'Sydney': { lat: -33.8688, lon: 151.2093 },
  }

  const { lat, lon } = cityCoordinates[city] || cityCoordinates['New York']

  return useQuery<WeatherData>({
    queryKey: ['weather', city],
    queryFn: async () => {
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      )
      return response.data?.current_weather || {
        temperature: 22.5,
        windspeed: 10.2,
        weathercode: 1,
        time: new Date().toISOString()
      }
    },
    staleTime: 1000 * 60 * 15, // Cache weather for 15 minutes
  })
}
