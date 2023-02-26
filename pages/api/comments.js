// posts.js
var censorjs = require('censorjs');

import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("comments");
  switch (req.method) {
    case "POST":
      const currentDate = new Date().toUTCString();
      req.body['Created'] = currentDate
      var cleaned = censorjs.clean(req.body['Body']);
      req.body['Body'] = cleaned
      let bodyObject = JSON.parse(JSON.stringify(req.body));
      await db.collection("comments").insertOne(bodyObject);
      res.redirect("/")
      break;
    case "GET":
      const allComments = await db.collection("comments").find({}).toArray();
      allComments.reverse()
      res.json({ status: 200, data: allComments });
      break;
  }
}
