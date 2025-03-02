import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SearchResult } from '../models';

@Component({
  selector: 'app-details',
  standalone: false,
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {

  // get activated route
  private route = inject(ActivatedRoute)

  // inject services
  private apiSvc = inject(ApiService)

  protected cityUnits: string = ''
  protected details!: SearchResult

  // on init, get details via id and display
  ngOnInit(): void {
    this.cityUnits = this.route.snapshot.paramMap.get('cityUnits')! // get cityUnits from param
    console.info('>>> RETRIEVING DATA FOR: ', this.cityUnits)
    this.apiSvc.retrieveData(this.cityUnits)
      .then(result => {
        this.details = result
        console.info('>>> RETRIEVED DATA: ', result)
      })
      .catch(err => {
        console.error('>>> ERROR FETCHING WEATHER DATA: ', err)
      })
  }

}
