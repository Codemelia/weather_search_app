import { Injectable } from "@angular/core";
import { SearchResult } from "../models";

@Injectable( { providedIn: "root" } )
export class StoreService {

    id: string = ''
    result!: SearchResult

    setDetails(id: string, result: SearchResult) {
        this.id = id
        this.result = result
    }

    getDetails(id: string) {
        return {
            id: this.id,
            result: this.result
        }
    }

}