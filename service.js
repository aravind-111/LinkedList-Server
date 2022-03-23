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
    },

    async deletePost(req, res) {
        try {
            const id = req.params.id;

            // GET ALL DATA FROM DB
            const allPosts = await mongodb.users.find().toArray();

            // GET CURRENT POST FROM DB
            const current_post = await mongodb.users.findOne({ post_id: id });
            
            // IF POST TO BE DELETED IS FIRST POST
            if(current_post.prev === null) {
                allPosts.map(async (post) => {
                    if(post.prev === current_post.post_id) {
                        const updatedPost = {
                            ...post,
                            prev: null
                        }
                        await mongodb.users.findOneAndUpdate({ post_id: post.post_id }, { $set: updatedPost }, { ReturnDocument: "after" });
                    }
                });
            }

            // IF POST TO BE DELETED IS LAST POST
            else if(current_post.next === null) {
                allPosts.map(async (post) => {
                    if(post.next === current_post.post_id) {
                        const updatedPost = {
                            ...post,
                            next: null
                        }
                        await mongodb.users.findOneAndUpdate({ post_id: post.post_id }, { $set: updatedPost }, { ReturnDocument: "after" });
                    }
                });
            }

            // ELSE
            else {
                allPosts.map(async (post) => {
                    if(post.next === current_post.post_id) {
                        const updatedPost = {
                            ...post,
                            next: current_post.next
                        }
                        await mongodb.users.findOneAndUpdate({ post_id: post.post_id }, { $set: updatedPost }, { ReturnDocument: "after" });
                    }
                    if(post.prev === current_post.post_id) {
                        const updatedPost = {
                            ...post,
                            prev: current_post.prev
                        }
                        await mongodb.users.findOneAndUpdate({ post_id: post.post_id }, { $set: updatedPost }, { ReturnDocument: "after" });
                    }
                })
            }
            await mongodb.users.deleteOne({ post_id: current_post.post_id });
            res.status(200).send("Successfully Deleted");
            
        } catch(e) {
            console.log(e);
            res.status(422).send("Error in Deleting");
        }
    },

    async getSinglePost(req, res) {
        try {
            const id = req.params.id;
            const singlePost = await mongodb.users.findOne({ post_id: id });
            res.status(200).send(singlePost);
        } catch(e) {
            console.log(e);
            res.status(422).send("Error in get");
        }
    },

    async getAllPosts(req, res) {
        try {
        const posts = await mongodb.users.find().toArray();
        res.status(200).send(posts);
        } catch(e) {
            console.log(e);
            res.status(422).send("Error in Fetching all Posts");
        }
    }
}

module.exports = services;


// let a = new Date(date);
// let b = a.toString();