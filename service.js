const mongodb = require("./mongo");
const crypto = require("crypto");

const services = {
    async newPostRoutes(req, res){
        try {
            // DATA TO STORE IN DB
            const date = new Date().getTime();
            const post_id = crypto.randomBytes(16).toString("hex");
            let pocket = {...req.body, date, post_id};

            // GET ALL DATA FROM DB
            const allPosts = await mongodb.users.find().toArray();

            // LAST DATA IN DB
            const lastData = allPosts[allPosts.length - 1];
            
            // LOGIC FOR FIRST POST
            if(allPosts.length === 0) {
                pocket = {...pocket, prev: null, next: null}
            }

            // LOGIC FOR CONSECUTIVE POST
            else {
                const updatedPost = {
                    ...lastData,
                    next: post_id
                }
                await mongodb.users.findOneAndUpdate({ post_id: lastData.post_id }, { $set: updatedPost }, { ReturnDocument: "after" });
                pocket = {...pocket, prev: lastData.post_id, next: null}
            }

            // POSTING NEW POST IN DB
            const insertNewUser = await mongodb.users.insertOne(pocket);
            res.status(200).send("Successfully posted");
        } catch(e) {
            console.log(e);
            res.status(422).send("Error in Posting");
        }
    }
}

module.exports = services;


// let a = new Date(date);
// let b = a.toString();