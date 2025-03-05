package vttp.batch5.day35.server.services;

import java.io.StringReader;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import vttp.batch5.day35.server.repositories.MongoRepository;

@Service
public class MongoService {

    @Autowired
    private MongoRepository mongoRepo;

    public int save(JsonArray payloadJson) throws Exception {
        return mongoRepo.save(payloadJson);
    }

    public List<JsonObject> retrieveAllMongo() {
        return mongoRepo.retrieveAllMongo().stream()
            .map(doc -> Json.createReader(new StringReader(doc.toJson())).readObject())
            .collect(Collectors.toList());
    }
    
}
