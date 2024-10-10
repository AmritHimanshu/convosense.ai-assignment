const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const path = require('path');

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 5000;

require('./db/conn');

app.use(cors({
    origin: true
}));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./router/auth'));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public/index.html'));
// });

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at port ${PORT}`);
});