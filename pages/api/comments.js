// posts.js

import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("comments");
  switch (req.method) {
    case "POST":
      let bodyObject = JSON.parse(req.body);
      let myComment = await db.collection("comments").insertOne(bodyObject);
      res.json(myComment.ops[0]);
      break;
    case "GET":
      const allComments = await db.collection("comments").find({}).toArray();
      res.json({ status: 200, data: allComments });
      break;
  }
}
