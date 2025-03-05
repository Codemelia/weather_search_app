import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchResult } from '../models/models';
import { DexieService } from '../services/dexie.service';
import { Subscription } from 'rxjs';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dexie',
  standalone: false,
  templateUrl: './dexie.component.html',
  styleUrl: './dexie.component.css'
})
export class DexieComponent implements OnInit, OnDestroy {
  
  private router = inject(Router)
  private dexieSvc = inject(DexieService)
  private apiSvc = inject(ApiService)

  protected results: SearchResult[] = []
  protected response: string = ''

  ngOnInit(): void {
    this.viewResults() // view results on init
  }

  // view all results in dexie db
  viewResults() {
    this.dexieSvc.viewResults()
      .then(
        results => {
          this. results = results
        }
      ).catch(
        err => {
          console.error('>>> ERROR OCCURRED WHEN RETRIEVING DEXIE RESULTS', err)
          this.router.navigate(['/'])
        }
      )
  }

  // for viewing details of each search entry
  viewDetails(cityUnits: string) {
    console.info('>>> SAVING DETAILS FOR VIEW')
    this.router.navigate([ '/city', cityUnits ])
  }  

  // remove specific weather result
  remove(id: string) {
    this.dexieSvc.removeResult(id)
    window.location.reload()
  }

  // save to mongo
  saveDB() {

    // get results from dexie
    this.dexieSvc.viewResults()
      .then(
        results => {
          this.results = results
          console.log('>>> RESULTS TO SAVE: ', this.results)
      }).catch(
        err => {
          throw err
        }
      )

    if (this.results && this.results.length > 0) {
      // save results to db and return lastid
      this.apiSvc.saveDB(this.results)
      .then(result => {
        this.response = result
        console.log('>>> DOCS SAVED: ', Number.parseInt(this.response))
      })
      .catch(err => {
        throw err
      })
    } else {
      console.log('>>> NOTHING TO SAVE TO DB')
    }
   
  }

  ngOnDestroy(): void {
      this.dexieSvc.clearDexie()
  }

}
