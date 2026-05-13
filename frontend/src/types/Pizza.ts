export interface Pizza {
  id?: number;
  name: string;
  price: number;
  size: 'Мала' | 'Середня' | 'Велика';
  description: string;
}
