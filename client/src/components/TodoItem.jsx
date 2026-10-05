import { useState } from 'react';

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleSave = () => {
    if (!newTitle.trim()) return;
    onEdit(todo._id, newTitle);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(false);
    }
  };

  const createdDate = todo.createdAt
    ? new Date(todo.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : 'Oct 5';

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-left" style={{ flex: 1 }}>
        <input
          type="checkbox"
          className="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo._id, todo.completed)}
        />

        {isEditing ? (
          <input
            type="text"
            className="edit-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <div className="todo-text-group">
            <span className="todo-title">{todo.title}</span>
            <span className="todo-date">Added {createdDate}</span>
          </div>
        )}
      </div>

      <div className="todo-actions">
        {isEditing ? (
          <>
            <button className="action-btn save-btn" onClick={handleSave} title="Save">
              ✓
            </button>
            <button
              className="action-btn cancel-btn"
              onClick={() => {
                setNewTitle(todo.title);
                setIsEditing(false);
              }}
              title="Cancel"
            >
              ✕
            </button>
          </>
        ) : (
          <>
            <button className="action-btn edit-btn" onClick={() => setIsEditing(true)} title="Edit task">
              ✏️
            </button>
            <button className="action-btn delete-btn" onClick={() => onDelete(todo._id)} title="Delete task">
              ✕
            </button>
          </>
        )}
      </div>
    </li>
  );
}