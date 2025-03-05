import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Subscription } from 'rxjs';
import { SearchResult } from '../models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store',
  standalone: false,
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent implements OnInit, OnDestroy {  

  private mongoSvc = inject(ApiService)

  protected sub!: Subscription
  protected results: SearchResult[] = []

  private router = inject(Router)

  ngOnInit(): void {
    this.sub = this.mongoSvc.viewMongo().subscribe({
      next: (response) => {
        this.results = response
      },
      error: (err) => {
        throw err
      }
    })
  }  

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

}
