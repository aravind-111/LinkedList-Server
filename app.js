const express = require("express");
const app = express();
const mongodb = require("./mongo");
const services = require("./service");
require("dotenv").config();

const PORT = 8080;

(async () => {
    try {
        await mongodb.connect();
        app.use(express.json());
        app.post("/newpost", services.newPostRoutes);
        app.delete("/deletepost/:id", services.deletePost);
        app.listen(PORT, () => {
            console.log("server started at http://localhost:8080/");
        })
    } catch(e) {
        console.log(e);
    }
})();