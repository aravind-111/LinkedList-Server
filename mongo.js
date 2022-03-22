const {MongoClient} = require("mongodb");
const URL = "mongodb+srv://aravindan:admin123@test-cluster-1.cho6i.mongodb.net/linked-list?retryWrites=true&w=majority";
// const URL = process.env.URL;
// const DB_NAME = process.env.DB_NAME;
const DB_NAME = "linked_list";
const client = new MongoClient(URL);

const mongodb = {
    db: null,
    users: null,

    async connect() {
        await client.connect();
        this.db = client.db(DB_NAME);
        this.users = this.db.collection("users");
    }
}

module.exports = mongodb;
