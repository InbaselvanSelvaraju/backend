const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const db = process.env.LOCAL_DATABASE;
const port = process.env.PORT;

mongoose.connect(db).then(() => {
  console.log("mongodb connected successful");
  app.listen(port, () => {
    console.log(`App running on ${port} ....`);
  });
});


