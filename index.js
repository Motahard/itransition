const express = require("express");
const cors = require("cors");
const path = require("path");

let app = express();
const expressWs = module.exports = require('express-ws')(app);
app = expressWs.app;

const db = require("./services/db");

const authRoute = require("./routes/auth");
const companiesRoute = require("./routes/companies");
const userRoute = require("./routes/user");

app.use(express.static(path.join(__dirname, "/client")));
app.use(express.json({ extended: true }));
app.use(cors());

app.use("/api", authRoute);
app.use("/api", companiesRoute);
app.use("/api", userRoute);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));

