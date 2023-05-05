var censorjs = require('censorjs');
import Cookies from 'cookies'
import clientPromise from "../../lib/mongodb";
import { authOptions } from './auth/[...nextauth]';
import { getServerSession } from "next-auth/next"

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  const cookies = new Cookies(req, res)
  const client = await clientPromise;
  const db = client.db("comments");
  if (req.method == "GET"){
    const allComments = await db.collection("comments").find({}).toArray();
    allComments.reverse()
    res.json({ status: 200, data: allComments });
  } else if (req.method == 'POST') {
    if (!session) {
      res.redirect("/?msg=You have to be logged in to comment");
      return;
    }
    const userid = session.user.image.replace("https://avatars.githubusercontent.com/u/", "").replace("?v=4", "")
    const resp = await fetch(
      `https://api.github.com/user/${userid}`
    );
    const data = await resp.json();
    const username = data['login']
    const currentDate = new Date().toUTCString();
    const user_comments = await db.collection("comments").find({"UserId": userid}).toArray();
    if (user_comments.length == 0){
      // no comments sent
    } else {
      var datenow = new Date(Date.parse(currentDate));
      var datethen = new Date(Date.parse(user_comments.at(-1)['Created']));
      var hours = Math.abs(datenow - datethen) / 36e5;
      if (hours < 1){
        res.redirect("/?msg=You can only message once an hour")
        return;
      }
    }
    var cleaned = censorjs.clean(req.body['Body']);
    if (cleaned.replaceAll(" ", "") == ""){
      res.redirect("/")
    }
    let bodyObject = {"Body": cleaned, "User": username, "Created": currentDate, "UserId": userid}
    await db.collection("comments").insertOne(bodyObject);
    // cookies.set('timeset', currentDate, {
    //   httpOnly: true
    // })
    res.redirect("/")
  }
}