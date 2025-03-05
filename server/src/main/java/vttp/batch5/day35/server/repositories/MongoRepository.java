package vttp.batch5.day35.server.repositories;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import com.mongodb.MongoException;
import com.mongodb.bulk.BulkWriteResult;
import com.mongodb.client.model.UpdateOneModel;
import com.mongodb.client.model.UpdateOptions;

import jakarta.json.JsonArray;
import jakarta.json.JsonObject;

@Repository
public class MongoRepository {

    @Autowired
    private MongoTemplate template;

    // save result json to mongo
    // mongo command
    /*
        db.results.update(
            { "id": <value> },
            { "$setOnInsert": doc },
            { upsert: true }
        )
    */
    public int save(JsonArray payloadJson) throws Exception {
        
        // conv json array to list of json objects
        List<JsonObject> jsonList = payloadJson.getValuesAs(JsonObject.class);

        System.out.println(jsonList);

        if (jsonList != null && !jsonList.isEmpty()) {

            // new list to hold batch ops
            List<UpdateOneModel<Document>> batchOps = new ArrayList<>();

            // iterate thru list
            // convert each json obj to document
            // match each doc by id
            // set each doc to insert into mongo if not present
            // add updateOps to list for batch insert
            for (JsonObject json : jsonList) {

                Document doc = Document.parse(json.toString());

                System.out.println(doc);

                UpdateOneModel<Document> updateOps = new UpdateOneModel<>(
                    new Document("_id", json.getString("id")),
                    new Document("$setOnInsert", doc),
                    new UpdateOptions().upsert(true)
                );

                batchOps.add(updateOps);

            }

            // make a batch insert into mongo

            try {

                // get collection and insert list of docs into mongo
                // return bulk write result
                BulkWriteResult result = template.getCollection("results").bulkWrite(batchOps);

                System.out.println(result);

                System.out.println(result.getUpserts().size());

                return result.getUpserts().size();

            } catch (MongoException e) {
                
                throw e;

            }

        } else {
            throw new Exception("Content to be saved on DB cannot be empty."); // custom error message
        }
        

    }

    // find all docs on mongodb
    // mongodb command
    /*
        db.results.find()
    */
    public List<Document> retrieveAllMongo() {
        return template.findAll(Document.class, "results");
    }
    
}
