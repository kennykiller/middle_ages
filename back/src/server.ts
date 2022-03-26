import path from "path";

import express, { Application } from "express";

import bodyParser from "body-parser";
import multer from "multer";
import { filmCreation, getGenres } from "./routes/admin/film";
import { getHomeData } from "./routes/film";
import sequelize from "../util/database";
import Film from "../models/film";
import PaymentStatus from "../models/payment-status";
import Ticket from "../models/ticket";
import Session from "../models/session";
import Order from "../models/order";
import User from "../models/user";
import Genre from "../models/genre";
import { getGenre } from "./controllers/admin/filmController";

const app: Application = express();
const port = 3000;
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../front/src/images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/svg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter }).single('posterUrl'));
app.use("/images", express.static(path.join(__dirname, "../front/src/images")));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
})
app.use('/admin', filmCreation);
app.use('/admin', getGenres);
app.use('/', getHomeData)

User.hasMany(Order);
Order.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
Order.hasOne(PaymentStatus);
PaymentStatus.belongsTo(Order);
Session.hasMany(Order);
Order.belongsTo(Session);
Order.hasMany(Ticket);
Ticket.belongsTo(Order);
Film.belongsToMany(Genre, { through: 'film_genres' });
Genre.belongsToMany(Film, { through: 'film_genres' });
Film.hasMany(Session, { constraints: true, onDelete: "CASCADE" });
Session.belongsTo(Film);
Ticket.belongsTo(Session);
Session.hasMany(Ticket, { constraints: true, onDelete: "CASCADE" }); //каждая сессия должна иметь места сколько в зале, чтобы их при покупке билета занимали

async function startServer() {
  try {
    await sequelize.sync();
    app.listen(port);
  } catch (e) {
    console.log(e);
  }
}

startServer();
