const cors = require("cors");
const express = require("express");
const main_route = require("./src/routes/Main");
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./src/utils/swagger/Swagger');
// const msg_back_replayer = require('./src/workers/msg_back_replayer');

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", main_route);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.get("*", (req, res) => {
  res.status(404).send("<h1>404 Not Found</h1>");
});

const PORT = 8081;
const HOST = "20.244.93.34";

app.listen(PORT, HOST, () => {
  console.log(`App started on ${HOST}:${PORT}`);

  require("./src/utils/mongo/MongoClient").connectDB();

  // msg_back_replayer();
});
