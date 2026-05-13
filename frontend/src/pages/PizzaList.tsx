import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { pizzaApi } from '../api/pizzaApi';
import { Pizza } from '../types/Pizza';

const SIZES: Record<string, string> = { 'Мала': '🍕 Мала', 'Середня': '🍕🍕 Середня', 'Велика': '🍕🍕🍕 Велика' };
const EMOJI = ['🍕', '🫓', '🧀', '🌶️', '🍖'];

function hashEmoji(name: string) {
  let h = 0;
  for (const c of name) h = (h + c.charCodeAt(0)) % EMOJI.length;
  return EMOJI[h];
}

interface DeleteModal { id: number; name: string }

export default function PizzaList() {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [filtered, setFiltered] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState<DeleteModal | null>(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  async function load() {
    try {
      setLoading(true);
      setError('');
      const data = await pizzaApi.getAll();
      setPizzas(data);
      setFiltered(data);
    } catch {
      setError('Помилка в опрацюванні запиту');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(pizzas.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.size.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    ));
  }, [search, pizzas]);

  async function confirmDelete() {
    if (!deleteModal) return;
    try {
      setDeleting(true);
      await pizzaApi.delete(deleteModal.id!);
      setDeleteModal(null);
      load();
    } catch {
      setError('Помилка в опрацюванні запиту');
      setDeleteModal(null);
    } finally {
      setDeleting(false);
    }
  }

  const totalValue = pizzas.reduce((s, p) => s + p.price, 0);

  return (
    <div className="page">
      {/* Header */}
      <div className="header">
        <div className="header-brand">
          <div className="header-logo">🍕</div>
          <div>
            <div className="header-title">PizzaCRUD</div>
            <div className="header-subtitle">Система управління меню піцерії</div>
          </div>
        </div>
        <Link to="/pizza/new" className="btn btn-primary">
          ＋ Додати піцу
        </Link>
      </div>

      {/* Error */}
      {error && <div className="banner banner-error">⚠️ {error}</div>}

      {/* Stats */}
      {!loading && pizzas.length > 0 && (
        <div className="stats-bar">
          <div className="stat-chip"><span>{pizzas.length}</span> позицій у меню</div>
          <div className="stat-chip"><span>{pizzas.filter(p => p.size === 'Мала').length}</span> малих</div>
          <div className="stat-chip"><span>{pizzas.filter(p => p.size === 'Середня').length}</span> середніх</div>
          <div className="stat-chip"><span>{pizzas.filter(p => p.size === 'Велика').length}</span> великих</div>
          <div className="stat-chip">Сума: <span>{totalValue.toFixed(0)}₴</span></div>
        </div>
      )}

      {/* Search */}
      {pizzas.length > 0 && (
        <div className="search-bar">
          <input
            id="search-input"
            className="search-input"
            placeholder="🔍  Пошук за назвою, розміром, описом..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button id="clear-search" className="btn btn-ghost" onClick={() => setSearch('')}>✕</button>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="loader">
          <div className="loader-dot" />
          <div className="loader-dot" />
          <div className="loader-dot" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🍽️</div>
          <h3>{search ? 'Нічого не знайдено' : 'Меню порожнє'}</h3>
          <p>{search ? 'Спробуйте інший запит' : 'Додайте першу піцу до меню'}</p>
          {!search && (
            <Link to="/pizza/new" className="btn btn-primary">＋ Додати піцу</Link>
          )}
        </div>
      ) : (
        <div className="pizza-grid">
          {filtered.map(pizza => (
            <div className="pizza-card" key={pizza.id} onClick={() => navigate(`/pizza/${pizza.id}`)}>
              <div className="pizza-card-header">
                <div className="pizza-emoji">{hashEmoji(pizza.name)}</div>
                <div className="pizza-badge">{SIZES[pizza.size] ?? pizza.size}</div>
              </div>
              <div className="pizza-name">{pizza.name}</div>
              <div className="pizza-desc">{pizza.description || <em style={{ opacity: 0.5 }}>Без опису</em>}</div>
              <div className="pizza-footer">
                <div className="pizza-price">{pizza.price.toFixed(0)}₴</div>
                <div className="pizza-actions" onClick={e => e.stopPropagation()}>
                  <button
                    id={`edit-btn-${pizza.id}`}
                    className="btn-icon"
                    title="Редагувати"
                    onClick={() => navigate(`/pizza/${pizza.id}`)}
                  >✏️</button>
                  <button
                    id={`delete-btn-${pizza.id}`}
                    className="btn-danger"
                    title="Видалити"
                    onClick={() => setDeleteModal({ id: pizza.id!, name: pizza.name })}
                  >🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h3>Видалити піцу?</h3>
            <p>«{deleteModal.name}» буде видалено назавжди. Цю дію не можна скасувати.</p>
            <div className="modal-actions">
              <button id="cancel-delete" className="btn btn-ghost" onClick={() => setDeleteModal(null)}>
                Скасувати
              </button>
              <button
                id="confirm-delete"
                className="btn btn-confirm-delete"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? 'Видалення...' : 'Видалити'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
