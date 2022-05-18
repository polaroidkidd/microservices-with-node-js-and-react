const express = require("express");

enum ROUTES {
  POSTS = "/posts",
}
const app = express();

app.get(ROUTES.POSTS, (req, res) => {});

app.post(ROUTES.POSTS, (req, res) => {});

app.listen(4000, () => {
  console.log("Listening on 4000");
});
