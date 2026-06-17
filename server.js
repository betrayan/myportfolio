const fs = require('fs');
const logStream = fs.createWriteStream('./server_debug.log', { flags: 'a' });

function log(message) {
    console.log(message);
    logStream.write(message + '\n');
}

log("Attempting to start server...");

try {
    require('dotenv').config();
    
    // ===== PRINT STATEMENTS FOR ENV TESTING =====
    log("========== ENV VARIABLES LOADED ==========");
    log("PORT: " + process.env.PORT);
    log("EMAIL_USER: " + process.env.EMAIL_USER);
    log("EMAIL_PASS: " + process.env.EMAIL_PASS);
    log("SECRET_PASSWORD: " + process.env.SECRET_PASSWORD);
    log("WHATSAPP_NUMBER: " + process.env.WHATSAPP_NUMBER);
    log("========== ENV VARIABLES LOADED ==========");
    
    const express = require('express');
    const nodemailer = require('nodemailer');
    const cors = require('cors');
    const bodyParser = require('body-parser');

    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    log("Dependencies loaded, creating transport...");

    // Email Transporter Configuration
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Test Route
    app.get('/', (req, res) => {
        res.send('Backend Server is Running correctly!');
    });

    // Contact Route
    app.post('/api/contact', (req, res) => {
        log("Received contact request");
        const { user_name, user_email, message } = req.body;

        const mailOptions = {
            from: user_email,
            to: process.env.EMAIL_USER,
            subject: `New Portfolio Message from ${user_name}`,
            text: `Name: ${user_name}\nEmail: ${user_email}\nMessage:\n${message}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                log("Error sending email: " + error);
                return res.status(500).json({ success: false, message: 'Failed to send email.' });
            } else {
                log('Email sent: ' + info.response);
                return res.status(200).json({ success: true, message: 'Email sent successfully!' });
            }
        });
    });

    // Secure WhatsApp Redirect Route
    app.get('/api/whatsapp', (req, res) => {
        const text = req.query.text;
        const number = process.env.WHATSAPP_NUMBER;

        if (!number) {
            return res.status(500).send('WhatsApp number not configured on server.');
        }

        const whatsappUrl = `https://wa.me/${number}?text=${text}`;
        res.redirect(whatsappUrl);
    });

    app.listen(PORT, (err) => {
        if (err) {
            log("Error starting server: " + err);
        } else {
            log(`Server is running on http://localhost:${PORT}`);
            log("✅ All Environment Variables Loaded Successfully!");
            log("✅ Email Service Configured: " + process.env.EMAIL_USER);
            log("✅ Secret Password Active: " + (process.env.SECRET_PASSWORD ? "YES" : "NO"));
        }
    });

} catch (e) {
    log("CRITICAL ERROR: " + e.message);
    log(e.stack);
}
