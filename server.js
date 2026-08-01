require('dotenv').config();
const express = require('express');
const path = require('path');
const multer = require('multer');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/contact', [
    body('name').notEmpty().withMessage('O nome é obrigatório.').trim().escape(),
    body('email').isEmail().withMessage('Forneça um email válido.').normalizeEmail(),
    body('message').notEmpty().withMessage('A mensagem é obrigatória.').trim().escape()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    console.log('--- Novo Contato Recebido ---');
    console.log(req.body);
    console.log('-----------------------------');

    res.status(200).json({ success: true, message: 'Mensagem enviada com sucesso!' });
});

app.post('/api/quote', [
    body('name').notEmpty().trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('phone').notEmpty().trim().escape(),
    body('address').notEmpty().trim().escape(),
    body('service').notEmpty().trim().escape(),
    body('date').notEmpty().trim(),
    body('notes').optional().trim().escape()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    console.log('--- Nova Solicitação de Orçamento ---');
    console.log(req.body);
    console.log('-------------------------------------');

    res.status(200).json({ success: true, message: 'Orçamento solicitado com sucesso! Entraremos em contato em breve.' });
});

app.post('/api/careers', upload.single('resume'), [
    body('name').notEmpty().trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('position').notEmpty().trim().escape()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    if (!req.file) {
        return res.status(400).json({ success: false, message: 'O envio do currículo é obrigatório.' });
    }

    console.log('--- Nova Candidatura de Emprego ---');
    console.log('Dados:', req.body);
    console.log('Arquivo Recebido (Memória):', req.file.originalname, `(${req.file.size} bytes)`);
    console.log('-----------------------------------');

    res.status(200).json({ success: true, message: 'Candidatura enviada com sucesso!' });
});


//  Tratamento de erros
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Ocorreu um erro interno no servidor.' });
});


// Inicio do servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor da EverGreen rodando em http://localhost:${PORT}`);
});