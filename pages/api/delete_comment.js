var censorjs = require('censorjs');
import Cookies from 'cookies'
import clientPromise from "../../lib/mongodb";
import { authOptions } from './auth/[...nextauth]';
import { getServerSession } from "next-auth/next"
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  const cookies = new Cookies(req, res)
  const client = await clientPromise;
  const db = client.db("comments");
  if (req.method == 'POST') {
    if (!session) {
      res.redirect("/");
      return;
    }
    const userid = session.user.image.replace("https://avatars.githubusercontent.com/u/", "").replace("?v=4", "")
    const resp = await fetch(
      `https://api.github.com/user/${userid}`
    );
    const data = await resp.json();
    const username = data['login']
    const comment_id = req.query["comment_id"]
    const comments = await db.collection("comments").find({"_id": new ObjectId(comment_id)}).toArray();
    if (comments.length != 0 && comments[0]['User'] == username){
        await db.collection("comments").deleteOne({"_id": new ObjectId(comment_id)});
    }
    res.redirect("/")
  } else {
    res.redirect("/")
  }
}