import express from "express";
import fetch from "node-fetch";
import { MongoClient, GridFSBucket } from "mongodb";
import cors from "cors";


const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());



/* ---------------- Mongo ---------------- */

const client = new MongoClient("mongodb://127.0.0.1:27017");
await client.connect();

const db = client.db("agri_db");
const bucket = new GridFSBucket(db);

/* =====================================================
   ✅ 1. GENERATE AUDIO + STORE IN MONGO
===================================================== */

app.post("/api/tts", async (req, res) => {
  try {
    const { text, advisoryId } = req.body;

    if (!text || !advisoryId) {
      return res.status(400).send("Missing text or advisoryId");
    }

    console.log("🎙 Generating audio...");

    const eleven = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/XrExE9yKIg1WjnnlVkGX/stream`,
      {
        method: "POST",
        headers: {
          "xi-api-key":
            process.env.ELEVENLABS_API_KEY ||
            "sk_ca696bb73eac6ab599a26604e8b4f9946f2e49dc2d30361f",
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5",
        }),
      }
    );

    if (!eleven.ok) {
      const err = await eleven.text();
      return res.status(500).send(err);
    }

    const uploadStream = bucket.openUploadStream(`${advisoryId}.mp3`);

    eleven.body.pipe(uploadStream);

    uploadStream.on("finish", async () => {
      await db.collection("advisories").insertOne({
        advisoryId,
        text,
        audio_file_id: uploadStream.id,
        audio_filename: `${advisoryId}.mp3`,
        createdAt: new Date(),
        });


        console.log("✅ Audio stored in Mongo");
        res.json({ success: true });
    });

    // VERY IMPORTANT
    // Tell frontend generation is complete
    //  

  } catch (err) {
    console.error(err);
    res.status(500).send("TTS generation failed");
  }
});

/* =====================================================
   ✅ 2. STREAM AUDIO FROM MONGO
===================================================== */

app.get("/api/tts/:id", async (req, res) => {
  try {
    const filename = `${req.params.id}.mp3`;

    const file = await bucket.find({ filename }).next();

    if (!file) {
      return res.status(404).send("Audio not found");
    }

    res.set({
      "Content-Type": "audio/mpeg",
      "Accept-Ranges": "bytes"
    });

    const downloadStream = bucket.openDownloadStreamByName(filename);

    downloadStream.pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).send("Streaming failed");
  }
});


app.listen(9000, () => {
  console.log("🚀 Server running on port 9000");
});
