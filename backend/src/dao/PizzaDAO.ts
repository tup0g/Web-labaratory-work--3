import db from '../db/database';
import { Pizza } from '../models/Pizza';

export class PizzaDAO {
    getAll(): Promise<Pizza[]> {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM pizzas ORDER BY id DESC', (err, rows) => {
                if (err) reject(err);
                else resolve(rows as Pizza[]);
            });
        });
    }

    getById(id: number): Promise<Pizza | undefined> {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM pizzas WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row as Pizza | undefined);
            });
        });
    }

    create(pizza: Pizza): Promise<Pizza> {
        return new Promise((resolve, reject) => {
            const { name, price, size, description } = pizza;
            db.run(
                'INSERT INTO pizzas (name, price, size, description) VALUES (?, ?, ?, ?)',
                [name, price, size, description],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, name, price, size, description });
                }
            );
        });
    }

    update(id: number, pizza: Pizza): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const { name, price, size, description } = pizza;
            db.run(
                'UPDATE pizzas SET name = ?, price = ?, size = ?, description = ? WHERE id = ?',
                [name, price, size, description, id],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.changes > 0);
                }
            );
        });
    }

    delete(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM pizzas WHERE id = ?', [id], function (err) {
                if (err) reject(err);
                else resolve(this.changes > 0);
            });
        });
    }
}

export const pizzaDAO = new PizzaDAO();
