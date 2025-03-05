import { Injectable } from "@angular/core";
import { SearchResult } from "../models/models";
import { db } from "../databases/dexie.db";

@Injectable({ providedIn: "root" })

export class DexieService {

    async addResults(results: SearchResult[]): Promise<string> {
        return await db.addResults(results)
    }

    async viewResults(): Promise<SearchResult[]> {
        return await db.viewResults()
    }

    async removeResult(id: string) {
        await db.removeResult(id)
    }

    async clearDexie() {
        db.clearResults()
    }

    async exists(id: string) {
        return await db.exists(id)
    }

}