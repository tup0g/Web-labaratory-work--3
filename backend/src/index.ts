import express from 'express';
import cors from 'cors';
import pizzaRoutes from './routes/pizzaRoutes';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/pizzas', pizzaRoutes);

app.listen(PORT, () => {
    console.log(`🍕 Server running at http://localhost:${PORT}`);
});

export default app;
