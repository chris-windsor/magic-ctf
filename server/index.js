const { Nuxt, Builder } = require("nuxt");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const ios = require("socket.io-express-session");
const MongoStore = require("connect-mongo")(session);
const logger = require("../utils/logger");
const process = require("process");

const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server);

const port = process.env.PORT || 3000;

app.set("port", port);

const connectionOptions = {
  autoIndex: false,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  poolSize: 10,
  bufferMaxEntries: 0,
  useNewUrlParser: true
};

mongoose.Promise = global.Promise;

require("dotenv").config();

mongoose.connect(
  `mongodb://localhost:27017/magic-ctf`,
  connectionOptions,
  (err, success) => {
    if (err) {
      logger.error("Encountered error while connecting to database...");
      logger.error("Shutting down server...");
      process.exit();
    } else logger.success("Successfully connected to database...");
  }
);

const db = mongoose.connection;

// Sessions to create `req.session`
app.use(
  session({
    secret: "work hard",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
  })
);

io.use(
  ios(
    session({
      secret: "work hard",
      resave: true,
      saveUninitialized: false,
      store: new MongoStore({
        mongooseConnection: db
      })
    })
  )
);

// Body parser, to access `req.body`
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

const routes = require("../routes/router");
app.use("/", routes);

// Import and Set Nuxt.js options
let config = require("../nuxt.config.js");
config.dev = !(process.env.NODE_ENV === "production");

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  // Give nuxt middleware to express
  app.use(nuxt.render);

  require("../utils/coreInitializer").init(db);
  require("../utils/socketHandler").init(io);

  // Listen the server
  server.listen(port, () =>
    logger.success(`Web server successfully started on port ${port}...`)
  );
}
start();

process.on("SIGINT", () => {
  process.exit();
});
