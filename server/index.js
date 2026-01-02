import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';
import { collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from './config/firebase.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Request logger for debugging
app.use((req, res, next) => {
    console.log(`Received ${req.method} request to ${req.url}`);
    next();
});

// Root route to check server status
app.get('/', (req, res) => {
    res.send('Server is running. API is at /api');
});

const PORT = process.env.PORT || 5003;
const SECRET_KEY = process.env.SECRET_KEY || "your_super_secret_jwt_key_here_change_in_prod";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "your_encryption_secret_key_here";

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No token provided' });

    const bearer = token.startsWith('Bearer ') ? token.slice(7) : token;

    jwt.verify(bearer, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
        req.userId = decoded.id;
        next();
    });
};

// Encryption Helper
const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

const decryptData = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// --- ROUTES ---

// Register
app.post('/api/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check if user exists
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        await addDoc(collection(db, "users"), {
            email,
            password: hashedPassword,
            name
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res.status(404).json({ message: "User not found" });
        }

        const userDoc = querySnapshot.docs[0];
        const user = userDoc.data();

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: userDoc.id }, SECRET_KEY, { expiresIn: 86400 }); // 24 hours

        res.status(200).json({ auth: true, token, user: { name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create Application
app.post('/api/applications', verifyToken, async (req, res) => {
    try {
        const { company, position, date, platform, link, status } = req.body;

        const applicationData = {
            company,
            position,
            date,
            platform,
            link,
            status
        };

        const encryptedContent = encryptData(applicationData);

        await addDoc(collection(db, "applications"), {
            userId: req.userId,
            content: encryptedContent,
            createdAt: new Date().toISOString()
        });

        res.status(201).json({ message: "Application saved successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Single Application
app.get('/api/applications/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const q = query(collection(db, "applications"), where("__name__", "==", id));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res.status(404).json({ message: "Application not found" });
        }

        const doc = querySnapshot.docs[0];
        const data = doc.data();

        // Ownership check
        if (data.userId !== req.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        try {
            const decrypted = decryptData(data.content);
            res.status(200).json({
                id: doc.id,
                ...decrypted,
                createdAt: data.createdAt
            });
        } catch (e) {
            res.status(500).json({ message: "Failed to decrypt application data" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Applications (List)
app.get('/api/applications', verifyToken, async (req, res) => {
    try {
        const q = query(collection(db, "applications"), where("userId", "==", req.userId));
        const querySnapshot = await getDocs(q);

        const applications = querySnapshot.docs.map(doc => {
            const data = doc.data();
            try {
                const decrypted = decryptData(data.content);
                return {
                    id: doc.id,
                    ...decrypted,
                    createdAt: data.createdAt
                };
            } catch (e) {
                return { id: doc.id, error: "Failed to decrypt" };
            }
        });

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Application
app.put('/api/applications/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { company, position, date, platform, link, status } = req.body;

        const applicationData = {
            company,
            position,
            date,
            platform,
            link,
            status
        };

        const encryptedContent = encryptData(applicationData);
        const appRef = doc(db, "applications", id);

        await updateDoc(appRef, {
            content: encryptedContent,
            updatedAt: new Date().toISOString()
        });

        res.status(200).json({ message: "Application updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Application
app.delete('/api/applications/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        await deleteDoc(doc(db, "applications", id));
        res.status(200).json({ message: "Application deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const startServer = (port) => {
    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    server.on('error', (e) => {
        if (e.code === 'EADDRINUSE') {
            console.log(`Port ${port} is in use, trying ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('Server error:', e);
        }
    });
};

startServer(PORT);

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
