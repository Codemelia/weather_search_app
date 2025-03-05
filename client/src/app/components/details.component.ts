import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SearchResult } from '../models/models';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-details',
  standalone: false,
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {

  private title = inject(Title)

  // get activated route
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  // inject services
  private apiSvc = inject(ApiService)

  protected cityUnits: string = ''
  protected details!: SearchResult

  // on init, get details via id and display
  ngOnInit(): void {
    this.title.setTitle('Weather Details')
    this.cityUnits = this.route.snapshot.paramMap.get('cityUnits')! // get cityUnits from param
    console.info('>>> RETRIEVING DATA FOR: ', this.cityUnits)
    this.apiSvc.retrieveData(this.cityUnits)
      .then(result => {
        this.details = result
        console.info('>>> RETRIEVED DATA: ', result)
      })
      .catch(err => {
        console.error('>>> ERROR FETCHING WEATHER DATA: ', err)
        this.router.navigate(['/']) // go back to landing page if there is error
      })
  }

}
