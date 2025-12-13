import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загрузка переменных окружения
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'db.json');
// На production используем dist, локально - public
const UPLOADS_DIR = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, '..', 'dist', 'assets', 'projects')
  : path.join(__dirname, '..', 'public', 'assets', 'projects');
const CORS_ORIGINS = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map(o => o.trim());

// Создание директории для загрузок если не существует
try {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
} catch (error) {
  console.error('Error creating uploads directory:', error);
}

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'project-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Разрешить запросы без origin (например, из Postman)
    if (!origin) return callback(null, true);

    if (CORS_ORIGINS.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Helper function to read database
async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { projects: [] };
  }
}

// Helper function to write database
async function writeDB(data) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
}

// GET all projects
app.get('/api/projects', async (req, res) => {
  try {
    const db = await readDB();
    res.json(db.projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET single project by ID
app.get('/api/projects/:id', async (req, res) => {
  try {
    const db = await readDB();
    const project = db.projects.find(p => p.id === parseInt(req.params.id));

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// POST create new project
app.post('/api/projects', async (req, res) => {
  try {
    const db = await readDB();
    const newProject = {
      id: db.projects.length > 0 ? Math.max(...db.projects.map(p => p.id)) + 1 : 1,
      ...req.body
    };

    db.projects.push(newProject);
    const success = await writeDB(db);

    if (success) {
      res.status(201).json(newProject);
    } else {
      res.status(500).json({ error: 'Failed to create project' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT update project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const db = await readDB();
    const index = db.projects.findIndex(p => p.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    db.projects[index] = {
      ...db.projects[index],
      ...req.body,
      id: parseInt(req.params.id) // Ensure ID doesn't change
    };

    const success = await writeDB(db);

    if (success) {
      res.json(db.projects[index]);
    } else {
      res.status(500).json({ error: 'Failed to update project' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const db = await readDB();
    const index = db.projects.findIndex(p => p.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    db.projects.splice(index, 1);
    const success = await writeDB(db);

    if (success) {
      res.json({ message: 'Project deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete project' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Upload image endpoint
app.post('/api/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Возвращаем путь к файлу относительно public
    const imagePath = `/assets/projects/${req.file.filename}`;

    res.json({
      success: true,
      path: imagePath,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Email endpoint using SMTP
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Configure nodemailer transporter for Mail.ru
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mail.ru',
      port: process.env.SMTP_PORT || 465,
      secure: true, // SSL
      auth: {
        user: process.env.SMTP_USER, // your-email@mail.ru
        pass: process.env.SMTP_PASS, // your app password
      },
    });

    // Email options
    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.RECIPIENT_EMAIL || process.env.SMTP_USER,
      subject: `Portfolio Contact: Message from ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Message from Portfolio</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
          </div>
          <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <p style="margin: 0 0 10px 0;"><strong>Message:</strong></p>
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
      replyTo: email,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      error: 'Failed to send email',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api/projects`);
});
