require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

connectDB(process.env.MONGO_URI);

// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/agents', require('./routes/agents'));
// app.use('/api/upload', require('./routes/upload'));
// app.use('/api/subagents', require('./routes/subagents'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/agents', require('./routes/agents'));
app.use('/api/subagents', require('./routes/subagents'));
app.use('/api/upload', require('./routes/upload'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));