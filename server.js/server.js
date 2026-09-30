const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 1. Endpoint Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

    if (error || !data) {
        return res.json({ status: "error", message: "Username atau Password salah!" });
    }
    res.json({ status: "success", username: data.username, role: data.role, pt_akses: data.pt_akses });
});

// 2. Endpoint Ambil Aset (Sesuai PT)
app.get('/api/assets', async (req, res) => {
    const { role, pt_akses } = req.query;
    let query = supabase.from('assets').select('*');
    if (role !== 'Admin') {
        query = query.eq('pt_pemilik', pt_akses);
    }
    const { data, error } = await query;
    if (error) return res.status(500).json({ status: "error", message: error.message });
    res.json({ status: "success", data: data });
});

// 3. Endpoint Tambah Aset
app.post('/api/assets', async (req, res) => {
    const { nama_aset, kategori, pt_pemilik } = req.body;
    const { data, error } = await supabase
        .from('assets')
        .insert([{ nama_aset, kategori, pt_pemilik }]);
    if (error) return res.status(500).json({ status: "error", message: error.message });
    res.json({ status: "success", message: "Aset berhasil ditambahkan!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));