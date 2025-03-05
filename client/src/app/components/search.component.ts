import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ApiService } from '../services/api.service';
import { SearchResult } from '../models/models';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { DexieService } from '../services/dexie.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit, OnDestroy {

  private http = inject(HttpClient)

  private dexieSvc = inject(DexieService)

  private fb = inject(FormBuilder)
  protected form!: FormGroup

  // inject services
  private apiSvc = inject(ApiService)

  // inject router
  private router = inject(Router)

  // to hold results
  protected results: SearchResult[] = []
  protected result!: SearchResult

  lastId: string = ''

  // to hold search terms
  searchTerms = {
    city: '',
    units: '' 
  }

  private title = inject(Title)

  protected redislen: number = 0
  private redisSizeSub!: Subscription
  private redisDataSub!: Subscription
  private clearRedisSub!: Subscription

  ngOnInit(): void {

    this.title.setTitle('Weather Search')

    // config session timeout - clears every 15 mins (900000 ms)
    // session timeout should be same with redis so that theres no conflict
    const sessionTimeout = setTimeout(() => {
      this.destroy()
      console.log('>>> SESSION EXPIRED, LOCAL STORAGE CLEARED')
      this.router.navigate(['/']) // redirect to landing page
    }, 900000)

    // on init assign form
    this.form = this.fb.group({
      city: this.fb.control<string>('', [ Validators.required ]),
      units: this.fb.control<string>('Standard') // defaults to standard
    })

    this.redisSizeSub = this.apiSvc.checkRedisSize().subscribe({
      next: (data) => { 
        this.redislen = data
        console.log('>>> REDIS LEN: ', this.redislen)
        // if redis length does not match curr local storage length
        if (localStorage.length > 0 && localStorage.length != this.redislen) {
          console.info('>>> VIEW DATA IS NOT UPDATED. RETRIEVING DATA FROM REDIS... ')
          this.retrieveRedis()
        } else {
          this.retrieveData()
        }
      },
      error: (err) => { 
        console.error(err)
        // re-init everything if error occurred
        this.results = []
        this.searchTerms.city = ''
        this.searchTerms.units = ''
      }
    })

  }

  // for retrieving storage data
  retrieveData() {
    // if there is stored session data, retrieve
    if (localStorage.length > 0) {
      let storedDataString = localStorage.getItem("currData")

      if (storedDataString) { // null check bc it cannot be parsed if it is null
        this.results = JSON.parse(storedDataString)
        console.info('>>> LOCAL STORED DATA: ', this.results)
      }

      // if there is stored session search, retrieve
      let storedTermsString = localStorage.getItem('currSearch')

        if (storedTermsString) {
          this.searchTerms = JSON.parse(storedTermsString)
          console.info('>>> LOCAL STORED TERMS: ', this.searchTerms)
        }

    } else {
      // re-init everything if no data retrieved
      this.results = []
      this.searchTerms.city = ''
      this.searchTerms.units = ''
    }
  }

  // for retrieving weather data
  search() {
    
    // assign form data to const
    this.searchTerms = this.form.value
    console.info('>>> SEARCH TERMS: ', this.searchTerms)

    // conduct weather search
    // assign result
    // if error, log on console
    this.apiSvc.searchWeather(this.searchTerms.city, this.searchTerms.units)
      .then(result => {
        console.info('>>> PUSHING RESULTS: ', result)
        this.results.push(result)
        this.result = result // assign for latest result
        this.saveSessionData()
      })
      .catch(err => {
        throw err
      })

  }
    
  // save session data
  saveSessionData() {
    console.info('>>> SAVING SESSION DATA: ', this.searchTerms, this.results)

    // update search terms
    localStorage.setItem("currSearch", JSON.stringify(this.searchTerms))
    
    // update session data with new results if results on page > 0
    if (this.results.length > 0) { 

      // attempt to retrieve data
      let storedDataString = localStorage.getItem("currData")

      if (storedDataString !== null) {
        const storedData = JSON.parse(storedDataString)
        
        // if stored data does not contain current result
        if (!storedData.some((data: { city: string; units: string; }) => 
          data.city === this.result.city && 
          data.units === this.result.units
        )) {
          // append new result to prev data
          storedData.push(this.result) 
          console.info('>>> PUSHED TO LOCAL STORAGE: ', this.result)
          localStorage.setItem("currData", JSON.stringify(storedData))
        }

      } else {
        localStorage.setItem("currData", JSON.stringify(this.results)) // set entire results array if it is initial array
      }
    
    }
  }

  // for viewing details of each search entry
  viewDetails(cityUnits: string) {
    if (cityUnits != undefined) {
      this.router.navigate([ '/city', cityUnits ])
    } else {
      window.location.reload()
    }
  }  

  // clear storage on destroy
  destroy(): void {
    localStorage.clear()
    this.dexieSvc.clearDexie()
    this.apiSvc.clearRedis()
    console.log('>>> ALL TEMPORARY DATA CLEARED')
    console.log(">>> DEXIE: ", this.dexieSvc.viewResults.length)
    console.log(">>> LOCAL: ", localStorage.length)
    console.log(">>> REDIS: TRUST ME BRO ")
  }

  // save results to dexie and navigate to dexie page
  async review() {

    // get last id from results array
    if (localStorage && localStorage.length > 0) {
      let storedDataString = localStorage.getItem("currData")

      if (storedDataString) { // null check bc it cannot be parsed if it is null
        this.results = JSON.parse(storedDataString)
      }

      this.lastId = this.results.at(this.results.length - 1)!.id
    } else {
      window.location.reload()
      return
    }

    // if last id exists in results array
    // skip add results method and navigate
    if (await this.dexieSvc.exists(this.lastId)) {
      console.log('>>> ID ALREADY EXISTS IN DEXIE: ', this.lastId)
    } else {
      this.dexieSvc.addResults(this.results)
        .then(result => {
          const dexId = result
          console.log('>>> LAST ID GENERATED ON DEXIE: ', dexId)
        })
        .catch(err => {
          throw err
        })
    }

    this.router.navigate([ '/review' ])
  }

  // retrieve all data from redis
  retrieveRedis() {
    this.redisDataSub = this.apiSvc.retrieveRedis().subscribe({
      next: (resp) => {
        this.results = resp
      },
      error: (err) => {
        throw err
      }
    })
  }

  // view saved results in mongodb (navigate to store page)
  viewDB() {
    this.router.navigate(['/store'])
  }

  ngOnDestroy(): void {
  }

}
