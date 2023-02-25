// posts.js

import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("comments");
  switch (req.method) {
    case "POST":
      console.log(req.body)
      let bodyObject = JSON.parse(JSON.stringify(req.body));
      console.log(bodyObject)
      let myComment = await db.collection("comments").insertOne(bodyObject);
      res.redirect("/")
      break;
    case "GET":
      const allComments = await db.collection("comments").find({}).toArray();
      res.json({ status: 200, data: allComments });
      break;
  }
}
