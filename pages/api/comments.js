var censorjs = require('censorjs');
import Cookies from 'cookies'
import clientPromise from "../../lib/mongodb";
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    res.redirect("/?msg=You have to be logged in to comment");
    return;
  }
  console.log(session)
  console.log(session.user)
  console.log(session.user.image)
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
      if (req.body['User'].replaceAll(" ", "") == ""){
        res.redirect("/")
        if (req.body['Body'].replaceAll(" ", "") == ""){
          res.redirect("/")
        }
      }
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