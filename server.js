import express from 'express';
import user from './src/backend/user.js';

const app = express();
const port = 3003;

app.get('/shop/user', user);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})