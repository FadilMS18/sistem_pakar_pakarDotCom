import express from "express";
import cors from "cors";
import { db } from "./db.js";

const app = express();

app.use(cors());
app.use(express.json()); // agar bisa baca JSON
app.use(express.static("."));

// Endpoint simpan pengunjung
app.post("/api/pengunjung", async (req, res) => {
  const { nama, usia, jenis_laptop, alasan_penggunaan } = req.body;
  try {
    const sql = `
            INSERT INTO pengunjung 
            (nama, usia, jenis_laptop, alasan_penggunaan)
            VALUES (?, ?, ?, ?)
        `;
    await db.execute(sql, [nama, usia, jenis_laptop, alasan_penggunaan]);

    res.json({ message: "Data pengunjung berhasil disimpan" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menyimpan data" });
  }
});

app.get('/api/gejala', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM gejala");
        res.json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
});

app.get('/api/relasi', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM relasi");
        res.json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
});

app.get('/api/kerusakan', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM kerusakan");
        res.json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
});

// Endpoint cek server
app.get("/", (req, res) => {
  res.send("Server berjalan dengan baik 🚀");
});

app.listen(3000, () => {
  console.log("Server running di http://localhost:3000");
});
