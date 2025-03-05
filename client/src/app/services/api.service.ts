import { inject, Injectable } from "@angular/core";
import { SearchResult } from "../models/models";
import { firstValueFrom, Observable, Subscription } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { dateTimestampProvider } from "rxjs/internal/scheduler/dateTimestampProvider";

@Injectable( { providedIn: "root" } )
export class ApiService {

  // inject http client
  private http = inject(HttpClient)

  // to store results
  private result!: SearchResult;
  protected response: string = ''

  private sub!: Subscription

  // REDIS FUNCTIONS

  // search weather and save to redis if not saved yet
  searchWeather(city: string, units: string): Promise<SearchResult> {

    // set params
    const params = new HttpParams()
        .set('city', city)
        .set('units', units)
    
    // build url with params
    // make http get request and return first value from result
    // assign result to this.result
    return firstValueFrom(
        this.http.get<SearchResult>('/api/search', { params })
    )

  }

  // retrieve details via id from redis
  retrieveData(cityUnits: string): Promise<SearchResult> {

    // set params
    const params = new HttpParams()
      .set('cityUnits', cityUnits)

    // build url with params
    // make http get request and return first value
    // assign result to this.result
    return firstValueFrom(
      this.http.get<SearchResult>('/api/city', { params })
    )

  }

  // check redis db size
  checkRedisSize(): Observable<number> {
    return this.http.get<number>('/api/checkRedis')
  }

  // retrieve all data from redis
  retrieveRedis(): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>('/api/retrieveRedis')
  }

  // clear all data  from redis
  clearRedis(): void {
    this.sub = this.http.get<void>('/api/clearRedis').subscribe({
      next: () => console.log('Redis cleared successfully'),
      error: (err) => console.error('Failed to clear Redis', err),
      complete: () => this.sub.unsubscribe()
    });
  }

  // MONGO FUNCTIONS

  // save list of weather data to mongodb
  // send with headers
  // returns last id for checking
  async saveDB(list: SearchResult[]): Promise<string> {

    // set custom headers
    const headers = new HttpHeaders()
      .set('timestamp', dateTimestampProvider.now().toString()) // send timestamp as string
      .set('Content-Type', 'application/json')

      this.response = await firstValueFrom(this.http.post<string>('/api/save', list))
      return this.response

  }

  viewMongo(): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>('/api/viewMongo')
  }

}