import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SearchComponent } from './components/search.component';
import { DetailsComponent } from './components/details.component';
import {ReactiveFormsModule} from '@angular/forms';
import {provideHttpClient} from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';
import { StoreComponent } from './components/store.component';
import { DexieComponent } from './components/dexie.component';
import { ServiceWorkerModule } from '@angular/service-worker';

const appRoutes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'city/:cityUnits', component: DetailsComponent },
  { path: 'review', component: DexieComponent },
  { path: 'store', component: StoreComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
]

@NgModule({
  declarations: [
    AppComponent, 
    SearchComponent, 
    DetailsComponent, StoreComponent, DexieComponent
  ],
  imports: [
    BrowserModule, 
    ReactiveFormsModule, 
    RouterModule.forRoot(appRoutes), ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: !isDevMode(),
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
})
  ],
  providers: [ provideHttpClient() ],
  bootstrap: [AppComponent]
})
export class AppModule { }
