## WEATHER SEARCH APP
```
This application allows the user to search and retrieve the weather in their desired city.

The Search function (landing) calls the Open Weather API, which returns the current weather data of the city.
- Weather data is saved to Local Storage and Redis

The Clear function (landing) allows the user to clear search results that are stored in all temporary storage.

The Review function (landing) allows the user to save the list of search results to Dexie indexedDB, and the user is navigated to a view of the current Dexie storage, where they can Remove any city they do not want to save.

The Save function (dexie) allows the user to save the reviewed list of search results to MongoDB database.

The Saved Results function (landing) allows the user to view the saved results from the MongoDB database.

```

#### Client 

```
ng new --standalone=false client

ng g c --flat --skip-tests components/upload

ng g c --flat --skip-tests components/view-image

ng g s --flat --skip-tests services/fileupload

ng g i model/UploadResult

ng serve --proxy-config proxy-config.js

```

```
npm i dexie
```

#### Server 

```
mvn clean spring-boot:run
```