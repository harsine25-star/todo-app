import { useState, useEffect } from 'react';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddTodo = async (title) => {
    try {
      const newTodo = await createTodo(title);
      setTodos((prev) => [newTodo, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      const updated = await updateTodo(id, { completed: !currentStatus });
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter((t) => t.completed);
    for (const todo of completedTodos) {
      await handleDelete(todo._id);
    }
  };

  // Counts
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = totalCount - completedCount;
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filtered List
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const todayDate = new Date().toLocaleDateString('en-US', dateOptions);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div>
          <span className="brand-title">BEING INFINITY'S</span>
          <h2 className="app-title">Todo App</h2>
        </div>

        <div className="progress-box">
          <div className="progress-circle" style={{ '--progress': `${percentComplete * 3.6}deg` }}>
            <span className="progress-text">{percentComplete}%</span>
          </div>
          <div className="progress-info">
            <span className="date-text">{todayDate}</span>
            <span className="stats-text">
              {completedCount} of {totalCount} tasks done
            </span>
          </div>
        </div>

        <nav className="nav-menu">
          <button
            className={`nav-item ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            <span>All tasks</span>
            <span className="badge">{totalCount}</span>
          </button>

          <button
            className={`nav-item ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            <span>Active</span>
            <span className="badge">{activeCount}</span>
          </button>

          <button
            className={`nav-item ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            <span>Completed</span>
            <span className="badge">{completedCount}</span>
          </button>
        </nav>

        {completedCount > 0 && (
          <button className="clear-completed-btn" onClick={handleClearCompleted}>
            Clear completed ({completedCount})
          </button>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="main-header">
          <h1>
            {filter === 'all' && 'All tasks'}
            {filter === 'active' && 'Active tasks'}
            {filter === 'completed' && 'Completed tasks'}
          </h1>
          <span className="total-count-text">{filteredTodos.length} tasks</span>
        </div>

        {error && <p style={{ color: '#ef4444' }}>{error}</p>}

        <TodoForm onAdd={handleAddTodo} />

        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;