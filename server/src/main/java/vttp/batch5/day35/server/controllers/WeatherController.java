package vttp.batch5.day35.server.controllers;

import java.io.StringReader;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import vttp.batch5.day35.server.services.MongoService;
import vttp.batch5.day35.server.services.WeatherService;

// allows for cross origin front-back end communication
@CrossOrigin(origins = "*", allowedHeaders = "*", 
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@RestController
@RequestMapping(path="/api", produces=MediaType.APPLICATION_JSON_VALUE)
public class WeatherController {

    @Autowired
    private WeatherService weatherSvc;

    @Autowired
    private MongoService mongoSvc;

    @GetMapping("/search")
    public ResponseEntity<String> getWeather(
        @RequestParam String city,
        @RequestParam(defaultValue = "Standard") String units // defaults to standard if not set
    ) throws Exception {

        // if city is null or empty, throw error
        if (city == null || city.isEmpty()) {
            throw new Exception("City parameter cannot be null or empty.");
        }

        // format city string
        city = city.trim().toLowerCase().replace(" ", "+");

        // checks if city search data exists in storage first
        // then makes api call to get weather data for city
        // finally saves search result to redis for 15 mins
        try {

            JsonObject weatherJson = weatherSvc.getWeather(city, units);
            return ResponseEntity.ok().body(weatherJson.toString()); // return weather json

        } catch (Exception e) {

            throw e;

        }

    }

    @GetMapping("/city")
    public ResponseEntity<String> retrieveData(
        @RequestParam String cityUnits
    ) {

        try {

            // retrieve data via id
            JsonObject dataJson = weatherSvc.retrieveData(cityUnits);
            return ResponseEntity.ok().body(dataJson.toString());

        } catch (Exception e) {

            throw e;

        }

    }

    @PostMapping(path = "/save", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveToMongo(
        @RequestBody String payload
    ) {

        System.out.println(payload);

        // conv payload to json
        JsonArray payloadJson = Json.createReader(new StringReader(payload)).readArray();

        // save to mongo and return response
        // if catch error, return error
        try {
            int response = mongoSvc.save(payloadJson);
            return ResponseEntity.ok().body(String.valueOf(response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(e.getMessage());
        }
        
    }

    // get redis db size
    @GetMapping(path="/checkRedis")
    public ResponseEntity<String> checkSize() {

        try {
            int size = weatherSvc.checkDb();
            return ResponseEntity.ok().body(String.valueOf(size));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(e.getMessage());
        }

    }

    @GetMapping(path="/retrieveRedis")
    public ResponseEntity<String> retrieveRedis() {

        // get list of json obj from redis
        try {
            List<JsonObject> redisList = weatherSvc.retrieveRedis();
            return ResponseEntity.ok().body(redisList.toString());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(e.getMessage());
        }

    }

    @GetMapping(path="/clearRedis")
    public ResponseEntity<String> clearRedis() {

        System.out.println(">>> CLEARING REDIS");

        // clear redis
        weatherSvc.clearRedis();

        return ResponseEntity.ok().body("REDIS CLEARED");

    }

    @GetMapping(path="/viewMongo")
    public ResponseEntity<String> viewMongo() {
        List<JsonObject> mongoList = mongoSvc.retrieveAllMongo();
        return ResponseEntity.ok().body(mongoList.toString());
    }

}
