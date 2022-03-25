const express = require("express");
const cors = require("cors");
const app = express();
const mongodb = require("./mongo");
const services = require("./service");
require("dotenv").config();

const PORT = 8080;

(async () => {
    try {
        app.use(cors());
        await mongodb.connect();
        app.use(express.json());
        app.post("/newpost", services.newPostRoutes);
        app.delete("/deletepost/:id", services.deletePost);
        app.get("/getsinglepost/:id", services.getSinglePost);
        app.post("/insertpostmiddle/:firstid/:secondid", services.insertPostMiddle)
        app.get("/getallposts", services.getAllPosts);
        app.listen(PORT, () => {
            console.log("server started at http://localhost:8080/");
        })
    } catch(e) {
        console.log(e);
    }
})();