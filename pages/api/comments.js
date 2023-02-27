var censorjs = require('censorjs');
import Cookies from 'cookies'

import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("comments");
  switch (req.method) {
    case "POST":
      const currentDate = new Date().toUTCString();
      const cookies = new Cookies(req, res)
      if (cookies.get('timeset') == null){
        // no cookie set
      } else {
        var datenow = new Date(Date.parse(currentDate));
        var datethen = new Date(Date.parse(cookies.get('timeset')));
        var hours = Math.abs(datenow - datethen) / 36e5;
        if (hours < 1){
          res.redirect("/?msg=You can only message once an hour")
          break;
        }
      }
      req.body['Created'] = currentDate
      var cleaned = censorjs.clean(req.body['Body']);
      req.body['Body'] = cleaned
      let bodyObject = JSON.parse(JSON.stringify(req.body));
      await db.collection("comments").insertOne(bodyObject);
      cookies.set('timeset', currentDate, {
        httpOnly: true
      })
      res.redirect("/")
      break;
    case "GET":
      const allComments = await db.collection("comments").find({}).toArray();
      allComments.reverse()
      res.json({ status: 200, data: allComments });
      break;
  }
}
