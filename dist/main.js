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
const express_1 = __importDefault(require("express"));
const promises_1 = __importDefault(require("node:fs/promises"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const diskStorage = multer_1.default.diskStorage({
    destination: 'images',
    filename(req, file, callback) {
        callback(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: diskStorage });
const app = (0, express_1.default)();
const router = express_1.default.Router();
app.use((0, cors_1.default)());
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileNames = yield promises_1.default.readdir('images');
    res.json(fileNames.map(fileName => `${req.protocol}://${req.hostname}:8080/gallery/images/${fileName}`));
}));
router.post('/', upload.array('images'), (req, res) => {
    res.status(201).json(req.files.map(file => {
        `${req.protocol}://${req.hostname}:8080/gallery/images/${file.originalname}`;
    }));
});
app.use('/gallery/images', router);
//built in middleware to serve static content
app.use('/gallery/images', express_1.default.static('images'));
app.listen(8080, () => {
    console.log("sever has been started at 8080");
});
