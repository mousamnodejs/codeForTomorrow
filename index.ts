import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { dbConfig } from './src/config/dbConfig'; 
import router from './src/routes/index';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());  // Enable CORS (Cross-Origin Resource Sharing)
app.use(morgan('dev'));  // Logging HTTP requests (only in dev mode)
app.use(express.json());  // For parsing JSON bodies
dbConfig()
app.use('/api/v1',router)
// Example route
app.get('/', (req, res) => {
  res.send('Hello from Express + Sequelize + MySQL!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
