import { inject, Injectable } from "@angular/core";
import { SearchResult } from "../models/models";
import { firstValueFrom } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable( { providedIn: "root" } )
export class ApiService {

  // inject http client
  private http = inject(HttpClient)

  // to store results
  private result!: SearchResult;

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

  // retrieve details via id
  retrieveData(cityUnits: string) {

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

}