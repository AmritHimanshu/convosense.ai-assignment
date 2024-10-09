const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 5000;

require('./db/conn');

app.use(cors({
    origin: true
}));

app.use(express.json());

app.use(require('./router/auth'));

app.get('/', (req, res) => {
    res.json({ message: "I am from app.js" });
})

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});