const cors = require("cors");
const express = require("express");
const MainRoute = require("./src/routes/Main");
const SwaggerUi = require('swagger-ui-express');
const SwaggerSpecs = require('./src/utils/swagger/Swagger');
const ReplaySystemWorker = require('./src/workers/ReplaySystemWorker');

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", MainRoute);

app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(SwaggerSpecs));

app.get("*", (req, res) => {
  res.status(404).send("<h1>404 Not Found</h1>");
});

const PORT = 8081;

app.listen(PORT , () => {
  console.log(`App started on :${PORT}`);

  require("./src/utils/mongo/MongoClient").connectDB();
  ReplaySystemWorker();

});
