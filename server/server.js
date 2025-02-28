const express = require("express");
const cors = require("cors");

const app = express();
const port = 8080;

//  Allow frontend to communicate with backend
app.use(
  cors({
    origin: "http://localhost:3000", //  Allows frontend access
    methods: ["GET", "POST", "PUT", "DELETE"], //  Allows these HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], //  Ensures JWT works
    credentials: true, //  Allows cookies and authentication
  })
);

app.use(express.json());

app.use("/user", require("./routes/user"));
app.use("/login", require("./routes/login"));

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});

// Root get API (for testing)
app.get("/", (req, res) => {
  res.send("Server is running!");
});
