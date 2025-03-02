export interface SearchTerms {
  city: string
  units: string
}

export interface SearchResult {
  id: string
  city: string
  units: string
  weather: string
  description: string
  icon: string
  temperature: number
  feelsLike: number
  pressure: number
  humidity: number
  visibility: number
  windspeed: number
  sunrise: string
  sunset: string
}