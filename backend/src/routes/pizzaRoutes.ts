import { Router } from 'express';
import { pizzaController } from '../controllers/PizzaController';

const router = Router();

router.get('/', pizzaController.getAll.bind(pizzaController));
router.get('/:id', pizzaController.getById.bind(pizzaController));
router.post('/', pizzaController.create.bind(pizzaController));
router.put('/:id', pizzaController.update.bind(pizzaController));
router.delete('/:id', pizzaController.delete.bind(pizzaController));

export default router;
