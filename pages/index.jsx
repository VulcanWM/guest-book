import Layout from '../components/layout'


export default function HomePage({ allComments }) {
  return (
    <div>
      <Layout pageTitle="Home">
        <h1>Hello</h1>
        <form action='/api/comments' method='POST'>
          <h2>Comment</h2>
          <input name="User" id="title"></input>
          <textarea name="Body"></textarea>
          <button type="submit">Button</button>
        </form>
        {
          allComments['data'].map((key, index) => ( 
            <p key={key['_id']}>{key['User']}: {key['Body']}</p> 
          ))
        }
      </Layout>
    </div>
  );
}

export async function getServerSideProps(context) {
  let res = await fetch("https://guest-book.vulcanwm.repl.co/api/comments", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let allComments = await res.json();
  return {
    props: { allComments },
  };
}