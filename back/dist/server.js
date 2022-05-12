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
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
const film_1 = __importDefault(require("./routes/film"));
const database_1 = __importDefault(require("../util/database"));
const film_2 = __importDefault(require("../models/film"));
const payment_status_1 = __importDefault(require("../models/payment-status"));
const ticket_1 = __importDefault(require("../models/ticket"));
const session_1 = __importDefault(require("../models/session"));
const order_1 = __importDefault(require("../models/order"));
const user_1 = __importDefault(require("../models/user"));
const genre_1 = __importDefault(require("../models/genre"));
const discount_1 = __importDefault(require("../models/discount"));
const admin_1 = __importDefault(require("./routes/admin"));
const home_1 = __importDefault(require("./routes/home"));
const app = (0, express_1.default)();
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
app.use((0, multer_1.default)({ storage: fileStorage, fileFilter }).single('posterUrl'));
app.use("/images", express_1.default.static(path_1.default.join(__dirname, "../front/src/images")));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});
app.use(admin_1.default);
app.use(home_1.default);
app.use('/films', film_1.default);
app.use('/', film_1.default);
user_1.default.hasMany(order_1.default);
order_1.default.belongsTo(user_1.default, { constraints: true, onDelete: "CASCADE" });
order_1.default.hasOne(payment_status_1.default);
payment_status_1.default.belongsTo(order_1.default);
session_1.default.hasMany(order_1.default);
order_1.default.belongsTo(session_1.default);
order_1.default.hasMany(ticket_1.default);
ticket_1.default.belongsTo(order_1.default);
discount_1.default.hasMany(ticket_1.default);
ticket_1.default.belongsTo(discount_1.default);
film_2.default.belongsToMany(genre_1.default, { through: 'film_genres' });
genre_1.default.belongsToMany(film_2.default, { through: 'film_genres' });
film_2.default.hasMany(session_1.default, { constraints: true, onDelete: "CASCADE" });
session_1.default.belongsTo(film_2.default);
ticket_1.default.belongsTo(session_1.default);
session_1.default.hasMany(ticket_1.default, { constraints: true, onDelete: "CASCADE" }); //каждая сессия должна иметь места сколько в зале, чтобы их при покупке билета занимали
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.default.sync();
            app.listen(port);
        }
        catch (e) {
            console.log(e);
        }
    });
}
startServer();
