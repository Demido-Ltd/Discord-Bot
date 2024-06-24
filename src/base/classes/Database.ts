import {MongoClient} from "mongodb";

export default class Database {
    private static client = new MongoClient(process.env.DBURI!);
    private static db = this.client.db("demido_ds");
    // static playlists = this.db.collection("playlists");
}