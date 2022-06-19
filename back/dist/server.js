"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
const film_1 = __importDefault(require("./routes/film"));
const database_1 = require("./util/database");
const film_2 = require("./models/film");
const payment_status_1 = require("./models/payment-status");
const ticket_1 = require("./models/ticket");
const session_1 = require("./models/session");
const order_1 = require("./models/order");
const user_1 = require("./models/user");
const refresh_token_1 = __importDefault(require("./models/refresh_token"));
const reset_token_1 = require("./models/reset_token");
const genre_1 = require("./models/genre");
const discount_1 = require("./models/discount");
const admin_1 = __importDefault(require("./routes/admin"));
const home_1 = __importDefault(require("./routes/home"));
const auth_1 = __importDefault(require("./routes/auth"));
const app = express_1.default();
const port = 3000;
const fileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../front/src/images");
    },
    filename: (req, file, cb) => {
        cb(null, Number(new Date()) + "-" + file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/svg" ||
        file.mimetype === "image/webp") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
app.use(body_parser_1.default.json());
app.use(cookie_parser_1.default());
app.use(multer_1.default({ storage: fileStorage, fileFilter }).single("posterUrl"));
app.use("/images", express_1.default.static(path_1.default.join(__dirname, "../front/src/images")));
app.use(cors_1.default({ origin: "http://localhost:8080" }));
app.use(admin_1.default);
app.use(home_1.default);
app.use("/films", film_1.default);
app.use("/auth", auth_1.default);
app.use("/", film_1.default);
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const { message } = error;
    const { data } = error;
    res.status(status).json({ message: message, data: data });
});
user_1.User.hasMany(order_1.Order);
user_1.User.hasOne(refresh_token_1.default);
user_1.User.hasOne(reset_token_1.ResetToken);
refresh_token_1.default.belongsTo(user_1.User, { foreignKey: "userId" });
reset_token_1.ResetToken.belongsTo(user_1.User, { foreignKey: "userId" });
order_1.Order.belongsTo(user_1.User, { constraints: true, onDelete: "CASCADE" });
order_1.Order.hasOne(payment_status_1.PaymentStatus);
payment_status_1.PaymentStatus.belongsTo(order_1.Order);
session_1.Session.hasMany(order_1.Order);
order_1.Order.belongsTo(session_1.Session);
order_1.Order.hasMany(ticket_1.Ticket);
ticket_1.Ticket.belongsTo(order_1.Order);
discount_1.Discount.hasMany(ticket_1.Ticket);
ticket_1.Ticket.belongsTo(discount_1.Discount);
film_2.Film.belongsToMany(genre_1.Genre, { through: "film_genres" });
genre_1.Genre.belongsToMany(film_2.Film, { through: "film_genres" });
film_2.Film.hasMany(session_1.Session, { constraints: true, onDelete: "CASCADE" });
session_1.Session.belongsTo(film_2.Film);
ticket_1.Ticket.belongsTo(session_1.Session);
session_1.Session.hasMany(ticket_1.Ticket, { constraints: true, onDelete: "CASCADE" }); //каждая сессия должна иметь места сколько в зале, чтобы их при покупке билета занимали
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.sequelize.sync();
            const server = app.listen(port);
            // const io = ioInstance.init(server);
            // io.on("connection", (socket) => {
            //   console.log("a user connected");
            //   socket.on("disconnect", () => {
            //     console.log("user disconnected");
            //   });
            //   socket.on("my message", (msg: string) => {
            //     console.log("message: " + msg);
            //     io.emit("my broadcast", `server: ${msg}`);
            //   });
            // });
        }
        catch (e) {
            console.log(e);
        }
    });
}
startServer();
