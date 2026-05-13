import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { pizzaApi } from '../api/pizzaApi';
import { Pizza } from '../types/Pizza';

const SIZES: Array<Pizza['size']> = ['Мала', 'Середня', 'Велика'];

const EMPTY: Pizza = { name: '', price: 0, size: 'Середня', description: '' };

export default function PizzaForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<Pizza>(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    pizzaApi.getById(Number(id))
      .then(data => { setForm(data); setLoading(false); })
      .catch(() => { setError('Помилка в опрацюванні запиту'); setLoading(false); });
  }, [id, isEdit]);

  function handle(field: keyof Pizza, value: string | number) {
    setForm(f => ({ ...f, [field]: value }));
    setError('');
  }

  function validate(): string | null {
    if (!form.name.trim()) return 'Введіть назву піци';
    if (form.price === undefined || form.price === null || isNaN(Number(form.price)) || Number(form.price) < 0)
      return 'Ціна повинна бути невідʼємним числом';
    if (!SIZES.includes(form.size)) return 'Оберіть розмір';
    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    try {
      setSaving(true);
      setError('');
      if (isEdit) {
        await pizzaApi.update(Number(id), form);
        setSuccess('Піцу оновлено! ✅');
      } else {
        await pizzaApi.create(form);
        setSuccess('Піцу додано! 🍕');
      }
      setTimeout(() => navigate('/'), 900);
    } catch {
      setError('Помилка в опрацюванні запиту');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      <Link to="/" className="form-back">← Назад до списку</Link>

      <div className="form-card">
        <div className="form-title">{isEdit ? '✏️ Редагувати піцу' : '🍕 Нова піца'}</div>

        {error && <div className="banner banner-error">⚠️ {error}</div>}
        {success && <div className="banner banner-success">{success}</div>}

        {loading ? (
          <div className="loader">
            <div className="loader-dot" />
            <div className="loader-dot" />
            <div className="loader-dot" />
          </div>
        ) : (
          <form onSubmit={submit} noValidate>

            <div className="form-group">
              <label className="form-label" htmlFor="pizza-name">Назва *</label>
              <input
                id="pizza-name"
                className="form-input"
                placeholder="Наприклад: Маргарита"
                value={form.name}
                onChange={e => handle('name', e.target.value)}
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pizza-price">Ціна (₴) *</label>
              <input
                id="pizza-price"
                type="number"
                min={0}
                step={0.01}
                className="form-input"
                placeholder="Наприклад: 249"
                value={form.price}
                onChange={e => handle('price', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pizza-size">Розмір *</label>
              <select
                id="pizza-size"
                className="form-select"
                value={form.size}
                onChange={e => handle('size', e.target.value)}
              >
                {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pizza-desc">Опис</label>
              <textarea
                id="pizza-desc"
                className="form-textarea"
                placeholder="Інгредієнти, склад, особливості..."
                value={form.description}
                onChange={e => handle('description', e.target.value)}
                maxLength={500}
              />
            </div>

            <div className="form-actions">
              <Link to="/" className="btn btn-ghost">Скасувати</Link>
              <button
                id="submit-btn"
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? '⏳ Збереження...' : isEdit ? '💾 Зберегти' : '➕ Додати'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
