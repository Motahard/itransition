const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./services/db");

const authRoute = require("./routes/auth");

const app = express();

app.use(express.static(path.join(__dirname, "/client")));
app.use(express.json({ extended: false }));
app.use(cors());

app.use("/api", authRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
