import Dexie, { Table } from "dexie"
import { SearchResult } from "../models/models"

export class DexieDB extends Dexie {

    // declare the table
    // SearchResult is the schema, string is var type of the primary key
    results!: Table<SearchResult, string>

    // constructor
    constructor() {
        super('resultsdb') // database name
        this.version(1).stores({ // schema version
            results: 'id' // results: collection name | id: use id field as primary key instead of auto-icr idx
        })
        this.results = this.table('results') // reference of the collection
    }

    async addResults(data: SearchResult[]): Promise<string> {
        const lastId = await db.results.bulkAdd(data) // bulk add array of results
        console.log('>>> ADDED TO DEXIE: ', lastId) // returns id of last added item
        return lastId
    }

    async removeResult(id: string) {
        await this.results.delete(id)
        console.log('>>> DELETED DEXIE ENTRY: ', id)
    }

    async clearResults() {
        this.results.clear
        console.log('>>> DEXIE CLEARED')
    }

    async viewResults(): Promise<SearchResult[]> {
        return await this.results.toArray()
    }

    async exists(id: string) {
        return await this.results.get(id) !== undefined // returns true/false depending on whether id exists in dexie
    }

}

export const db = new DexieDB()