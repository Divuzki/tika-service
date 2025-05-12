const express = require('express');
const axios = require('axios');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const tikaUrl = process.env.TIKA_URL || 'http://localhost:9998';

// Configure storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Tika version endpoint
app.get('/version', async (req, res) => {
  try {
    const response = await axios.get(`${tikaUrl}/version`);
    res.status(200).send(response.data);
  } catch (error) {
    console.error('Error fetching Tika version:', error);
    res.status(500).json({ error: 'Failed to fetch Tika version' });
  }
});

// Text extraction endpoint
app.post('/extract', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const response = await axios.put(
      `${tikaUrl}/tika`,
      req.file.buffer,
      {
        headers: {
          'Content-Type': req.file.mimetype,
          'Accept': 'text/plain'
        }
      }
    );
    
    res.status(200).json({ text: response.data });
  } catch (error) {
    console.error('Error extracting text:', error);
    res.status(500).json({ error: 'Failed to extract text' });
  }
});

app.listen(port, () => {
  console.log(`Tika API server running on port ${port}`);
});