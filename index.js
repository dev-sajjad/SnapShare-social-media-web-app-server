import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/userAuth.js";

import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// default routes
app.use('/posts', postRoutes);
app.use('/jwt', authRoutes)

app.use('/', (req, res) => {
  res.json('Application running!')
})

// mongodb url
const CONNECTION_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ozga6sm.mongodb.net/?retryWrites=true&w=majority`;

// connect mongoose
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(port, () => console.log(`Server started on port: ${port}`)))
  .catch((error) => console.error(error.message));
  
mongoose.set("strictQuery", true);