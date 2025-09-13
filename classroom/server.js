import express from "express";
const app = express();
import session from "express-session";
import flash from 'connect-flash';
app.use(
  session({
    secret: "mysuperstrongstringsecret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;
  console.log(req.session);
  req.flash("success","user was created successfully")
  res.redirect("/hello");
});

app
app.get("/hello", (req, res) => {
  res.send(`hello ${req.session.name}`);
});

// app.get("/", (req, res) => {
//   res.send("test succesful");
// });

// app.get("/reqcount", (req, res) => {
//     let x = 1;
//   res.send(`you requested ${x} times`);
// });

app.listen(3000, () => {
  console.log("app, classroom listining...");
});
