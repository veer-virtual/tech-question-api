import express, {Request, Response} from "express";
import * as dotevnv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import admin from "firebase-admin";

const serviceAccount = require("./config/firebaseConfig.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://fileuploaddemo-a176e.appspot.com",
});

const db = admin.firestore();
const bucket = admin.storage().bucket();
const upload = multer({ dest: "uploads/" });

dotevnv.config();

if (!process.env.PORT) {
  console.log(`Port not defile`);
}

const PORT = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/api/getUploadedFiles", async(req : Request, res : Response) => {
  db.collection("fileUploadDetails")
    .get()
    .then((querySnapshot) => {
      const data: any = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      res.json(data);
    })
    .catch((error) => {
      console.error("Error getting documents: ", error);
      throw error;
    });
});

app.post("/api/upload", upload.single("file"), async (req : Request, res : Response) => {
    try {
      const file: any = req.file;
      const originalname = file.originalname;
      const mimetype = file.mimetype;
      const size = file.size;
      const filetype = mimetype.split('/')[0];
  
      // Upload file to Firebase Storage
      const storageRes = await bucket.upload(file.path, {
        destination: "uploads/" + originalname,
        metadata: {
          contentType: mimetype,
        },
      });
      const files = storageRes[0];
      const url = await files.getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      });
  
      // Save file metadata to Firestore
      await db.collection("fileUploadDetails").add({
        originalname: originalname,
        url: url[0],
        size: size,
        fileType: filetype,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      res.json({ status: "success", filePath: url[0] });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).send("Error uploading file");
    }
  });

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
