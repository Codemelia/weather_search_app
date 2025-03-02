import { Component, inject, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ApiService } from '../services/api.service';
import { SearchResult } from '../models';
import { StoreService } from '../services/store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {

  private fb = inject(FormBuilder)
  protected form!: FormGroup

  // inject services
  private apiSvc = inject(ApiService)
  private storeSvc = inject(StoreService)

  // inject router
  private router = inject(Router)

  // to hold results
  protected results: SearchResult[] = []

  // on init assign form
  ngOnInit(): void {
    this.form = this.fb.group({
      city: this.fb.control<string>('', [ Validators.required ]),
      units: this.fb.control<string>('standard') // defaults to standard
    })
  }

  // for retrieving weather data
  search() {
    
    // assign form data to const
    const terms = this.form.value
    console.info('>>> SEARCH TERMS: ', terms)

    // conduct weather search
    // assign result
    // if error, log on console
    this.apiSvc.searchWeather(terms.city, terms.units)
      .then(result => {
        console.info('>>> PUSHING RESULTS: ', result)
        this.results.push(result)
      })
      .catch(err => {
        console.error('>>> ERROR FETCHING WEATHER DATA: ', err)
      })

  }

  // for viewing details of each search entry
  viewDetails(cityUnits: string) {
    console.info('>>> SAVING DETAILS FOR VIEW')
    this.router.navigate([ '/city', cityUnits ])
  }

}
