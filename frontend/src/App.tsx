import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PizzaList from './pages/PizzaList';
import PizzaForm from './pages/PizzaForm';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PizzaList />} />
        <Route path="/pizza/new" element={<PizzaForm />} />
        <Route path="/pizza/:id" element={<PizzaForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
