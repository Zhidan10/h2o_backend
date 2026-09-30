require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Menghubungkan ke Supabase menggunakan variabel Railway
const supabaseUrl = 'sb_publishable_TcaPBW6aTox54wwJ0q2g0g_hLLUXplP';
const supabaseKey = 'sb_secret_Iq5sVkvUL_PrEkbEvTX6YQ_CrTvzqac';
const supabase = createClient(supabaseUrl, supabaseKey);

// Rute tes untuk mengecek apakah server berjalan
app.get('/', (req, res) => {
  res.send('Backend H2O Berjalan dengan Baik!');
});

// Rute untuk Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  const { data, error } = await supabase
    .from('zhidan')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single();

  if (error || !data) {
    return res.status(401).json({ success: false, message: 'Username atau password salah!' });
  }

  res.json({ success: true, message: 'Login berhasil', user: data });
});

// Menjalankan server sesuai port Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
