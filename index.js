const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
//const path = require("path");
const app = express();

app.use(express.json({ extended: false }));
app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
