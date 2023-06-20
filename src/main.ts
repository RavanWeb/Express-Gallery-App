import express from 'express';
import fs from 'node:fs/promises';
import cors from 'cors';
import multer from "multer";

const diskStorage = multer.diskStorage({
    destination: 'images',
    filename(req:Express.Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
        callback(null, file.originalname);
    }
});

const upload = multer({storage: diskStorage});

const app = express();
const router = express.Router();

app.use(cors());

router.get("/", async (req, res) => {
    const fileNames = await fs.readdir('images');
    res.json(fileNames.map(fileName=>
        `${req.protocol}://${req.hostname}:8080/gallery/images/${fileName}`
    ));
});


router.post('/', upload.array('images'), (req, res) => {
    res.status(201).json((req.files as Express.Multer.File[]).map(file=>{
        `${req.protocol}://${req.hostname}:8080/gallery/images/${file.originalname}`
    }));
});


app.use('/gallery/images',router);

//built in middleware to serve static content

app.use('/gallery/images', express.static('images'));
app.listen(8080,()=>{
    console.log("sever has been started at 8080");
})