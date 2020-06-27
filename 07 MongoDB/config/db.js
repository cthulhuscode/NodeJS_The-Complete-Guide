const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const connectionString =
    "mongodb+srv://" +
    process.env.DB_USER +
    ":" +
    process.env.DB_PASS +
    "@courses-sbaks.mongodb.net/shop?retryWrites=true&w=majority";

const mongoConnect = (callback) => {
    MongoClient.connect(connectionString, { useUnifiedTopology: true })
        .then((client) => {
            console.log("DB connected");
            _db = client.db();
            callback();
        })
        .catch((err) => {
            console.log(err);
            throw erro;
        });
};

const getDb = () => {
    if (_db) return _db;
    throw "No database found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
