import type { Category } from '../services/api';
import { createCategory, deleteCategory } from '../services/api';
import { useState } from 'react';

interface CategoryManagerProps {
  categories: Category[];
  onDataChange: () => void;
}

export function CategoryManager({ categories, onDataChange }: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState('');

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError('Category name cannot be empty.');
      return;
    }
    try {
      await createCategory(newCategoryName);
      setNewCategoryName('');
      setError('');
      onDataChange();
    } catch (err) {
      setError('Failed to create category. Does it already exist?');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        onDataChange();
      } catch (err) {
        setError('Failed to delete category. It might be in use.');
      }
    }
  };

  return (
    <div className="card">
      <h2>Manage Categories</h2>
      <form onSubmit={handleAddCategory} className="category-form">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New category name (e.g., Pharmacy)"
        />
        <button type="submit">Add</button>
      </form>
      {error && <p className="error-text">{error}</p>}
      <ul className="category-list">
        {categories.map((cat) => (
          <li key={cat.id}>
            {cat.name}
            <button onClick={() => handleDeleteCategory(cat.id)} className="delete-btn">
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
