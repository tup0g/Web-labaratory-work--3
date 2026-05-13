import { Request, Response } from 'express';
import { pizzaDAO } from '../dao/PizzaDAO';
import { Pizza } from '../models/Pizza';

const ERROR_MSG = 'Помилка в опрацюванні запиту';

function validatePizza(body: Partial<Pizza>): string | null {
    const { name, price, size, description } = body;
    if (!name || typeof name !== 'string' || name.trim() === '') return 'Назва піци обовʼязкова';
    if (price === undefined || price === null || isNaN(Number(price)) || Number(price) < 0) return 'Ціна повинна бути невідʼємним числом';
    if (!size || !['Мала', 'Середня', 'Велика'].includes(size)) return 'Розмір: Мала, Середня або Велика';
    if (description !== undefined && typeof description !== 'string') return 'Опис повинен бути рядком';
    return null;
}

export class PizzaController {
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const pizzas = await pizzaDAO.getAll();
            res.json(pizzas);
        } catch {
            res.status(500).json({ error: ERROR_MSG });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) { res.status(400).json({ error: ERROR_MSG }); return; }
            const pizza = await pizzaDAO.getById(id);
            if (!pizza) { res.status(404).json({ error: 'Піцу не знайдено' }); return; }
            res.json(pizza);
        } catch {
            res.status(500).json({ error: ERROR_MSG });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const err = validatePizza(req.body);
            if (err) { res.status(400).json({ error: err }); return; }
            const pizza = await pizzaDAO.create({
                name: req.body.name.trim(),
                price: Number(req.body.price),
                size: req.body.size,
                description: req.body.description?.trim() || '',
            });
            res.status(201).json(pizza);
        } catch {
            res.status(500).json({ error: ERROR_MSG });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) { res.status(400).json({ error: ERROR_MSG }); return; }
            const err = validatePizza(req.body);
            if (err) { res.status(400).json({ error: err }); return; }
            const updated = await pizzaDAO.update(id, {
                name: req.body.name.trim(),
                price: Number(req.body.price),
                size: req.body.size,
                description: req.body.description?.trim() || '',
            });
            if (!updated) { res.status(404).json({ error: 'Піцу не знайдено' }); return; }
            res.json({ message: 'Піцу оновлено' });
        } catch {
            res.status(500).json({ error: ERROR_MSG });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) { res.status(400).json({ error: ERROR_MSG }); return; }
            const deleted = await pizzaDAO.delete(id);
            if (!deleted) { res.status(404).json({ error: 'Піцу не знайдено' }); return; }
            res.json({ message: 'Піцу видалено' });
        } catch {
            res.status(500).json({ error: ERROR_MSG });
        }
    }
}

export const pizzaController = new PizzaController();
