// Global variables
let currentUser = null;
let accessToken = null;
let currentPage = 1;
let currentFilters = {};
// Edit mode state
let isEditMode = false;
let editingTodoId = null;

// DOM elements
const authForms = document.getElementById('authForms');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const todoApp = document.getElementById('todoApp');
const userInfo = document.getElementById('userInfo');
const username = document.getElementById('username');
const logoutBtn = document.getElementById('logoutBtn');
const loading = document.getElementById('loading');
const toast = document.getElementById('toast');
// Add Todo/Edit Todo elements
const todoSubmitBtn = document.getElementById('todoSubmitBtn');

// API base URL
const API_BASE = '/api/v1';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    // Check if user is already logged in
    const token = localStorage.getItem('accessToken');
    if (token) {
        accessToken = token;
        checkAuthStatus();
    }
}

function setupEventListeners() {
    // Auth form toggles
    document.getElementById('showRegister').addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });

    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });

    // Form submissions
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    document.getElementById('registerFormElement').addEventListener('submit', handleRegister);
    logoutBtn.addEventListener('click', handleLogout);

    // Todo form
    document.getElementById('addTodoForm').addEventListener('submit', handleAddTodo);

    // Add New Todo button toggle
    document.getElementById('addNewTodoBtn').addEventListener('click', showAddTodoForm);
    document.getElementById('cancelAddTodoBtn').addEventListener('click', hideAddTodoForm);

    // Filters and search
    document.getElementById('searchInput').addEventListener('input', debounce(handleSearch, 500));
    document.getElementById('statusFilter').addEventListener('change', handleFilterChange);
    document.getElementById('priorityFilter').addEventListener('change', handleFilterChange);
}

// Auth Functions
async function handleLogin(e) {
    e.preventDefault();
    showLoading(true);

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            accessToken = data.data.accessToken;
            currentUser = data.data.user;
            
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            showToast('Login successful!', 'success');
            showTodoApp();
            loadTodos();
        } else {
            showToast(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        showToast('An error occurred during login', 'error');
        console.error('Login error:', error);
    } finally {
        showLoading(false);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    showLoading(true);

    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`${API_BASE}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (data.success) {
            showToast('Registration successful! Please login.', 'success');
            showLoginForm();
            document.getElementById('registerFormElement').reset();
        } else {
            showToast(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showToast('An error occurred during registration', 'error');
        console.error('Registration error:', error);
    } finally {
        showLoading(false);
    }
}

async function handleLogout() {
    try {
        await fetch(`${API_BASE}/users/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    } catch (error) {
        console.error('Logout error:', error);
    }

    // Clear local storage and state
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    accessToken = null;
    currentUser = null;

    showAuthForms();
    showToast('Logged out successfully', 'info');
}

async function checkAuthStatus() {
    try {
        const response = await fetch(`${API_BASE}/users/me`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();

        if (data.success) {
            currentUser = data.data;
            showTodoApp();
            loadTodos();
        } else {
            // Token is invalid, clear it
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            accessToken = null;
            currentUser = null;
        }
    } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        accessToken = null;
        currentUser = null;
    }
}

// Todo Functions
async function handleAddTodo(e) {
    e.preventDefault();
    showLoading(true);

    const title = document.getElementById('todoTitle').value;
    const description = document.getElementById('todoDescription').value;
    const priority = document.getElementById('todoPriority').value;
    const dueDate = document.getElementById('todoDueDate').value;
    const tags = document.getElementById('todoTags').value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

    try {
        let response;
        if (isEditMode && editingTodoId) {
            // Update existing todo
            response = await fetch(`${API_BASE}/todos/${editingTodoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ title, description, priority, dueDate: dueDate || undefined, tags })
            });
        } else {
            // Create new todo
            response = await fetch(`${API_BASE}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ title, description, priority, dueDate: dueDate || undefined, tags })
            });
        }

        const data = await response.json();

        if (data.success) {
            const msg = isEditMode ? 'Todo updated successfully!' : 'Todo created successfully!';
            showToast(msg, 'success');
            document.getElementById('addTodoForm').reset();
            // Reset edit mode
            isEditMode = false;
            editingTodoId = null;
            todoSubmitBtn.textContent = 'Add Todo';
            hideAddTodoForm();
            loadTodos();
        } else {
            showToast(data.message || (isEditMode ? 'Failed to update todo' : 'Failed to create todo'), 'error');
        }
    } catch (error) {
        console.error(isEditMode ? 'Update todo error:' : 'Create todo error:', error);
        showToast(isEditMode ? 'An error occurred while updating todo' : 'An error occurred while creating todo', 'error');
    } finally {
        showLoading(false);
    }
}

// Toggle Add Todo Form Functions
function showAddTodoForm() {
    document.getElementById('addNewTodoBtn').style.display = 'none';
    document.getElementById('addTodoFormContainer').style.display = 'block';
}

function hideAddTodoForm() {
    document.getElementById('addNewTodoBtn').style.display = 'block';
    document.getElementById('addTodoFormContainer').style.display = 'none';
    document.getElementById('addTodoForm').reset();
    // Reset edit state when hiding
    isEditMode = false;
    editingTodoId = null;
    if (todoSubmitBtn) todoSubmitBtn.textContent = 'Add Todo';
}

async function loadTodos(page = 1) {
    showLoading(true);
    currentPage = page;

    try {
        const queryParams = new URLSearchParams({
            page: page,
            limit: 10,
            ...currentFilters
        });

        const response = await fetch(`${API_BASE}/todos?${queryParams}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();

        if (data.success) {
            displayTodos(data.data.todos);
            displayPagination(data.data.pagination);
        } else {
            showToast(data.message || 'Failed to load todos', 'error');
        }
    } catch (error) {
        showToast('An error occurred while loading todos', 'error');
        console.error('Load todos error:', error);
    } finally {
        showLoading(false);
    }
}

function displayTodos(todos) {
    const todosList = document.getElementById('todosList');
    
    if (todos.length === 0) {
        todosList.innerHTML = '<div class="no-todos">No todos found. Create your first todo!</div>';
        return;
    }

    todosList.innerHTML = todos.map(todo => `
        <div class="todo-item ${todo.status === 'completed' ? 'completed' : ''}" data-id="${todo._id}">
            <div class="todo-header">
                <div>
                    <div class="todo-title">${todo.title}</div>
                    <div class="todo-meta">
                        <span class="todo-priority ${todo.priority}">${todo.priority}</span>
                        <span class="todo-status ${todo.status}">${todo.status.replace('_', ' ')}</span>
                        ${todo.dueDate ? `<span><i class="fas fa-calendar"></i> ${new Date(todo.dueDate).toLocaleDateString()}</span>` : ''}
                    </div>
                </div>
                <div class="todo-actions">
                    ${todo.status !== 'completed' ? `
                        <button class="btn btn-success" onclick="updateTodoStatus('${todo._id}', 'completed')">
                            <i class="fas fa-check"></i> Complete
                        </button>
                    ` : ''}
                    ${todo.status === 'pending' ? `
                        <button class="btn btn-warning" onclick="updateTodoStatus('${todo._id}', 'in_progress')">
                            <i class="fas fa-play"></i> Start
                        </button>
                    ` : ''}
                    <button class="btn btn-secondary" onclick="editTodo('${todo._id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteTodo('${todo._id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
            ${todo.description ? `<div class="todo-description">${todo.description}</div>` : ''}
            ${todo.tags && todo.tags.length > 0 ? `
                <div class="todo-tags">
                    ${todo.tags.map(tag => `<span class="todo-tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');
}

function displayPagination(pagination) {
    const paginationElement = document.getElementById('pagination');
    
    if (pagination.pages <= 1) {
        paginationElement.innerHTML = '';
        return;
    }

    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button ${pagination.page <= 1 ? 'disabled' : ''} onclick="loadTodos(${pagination.page - 1})">
            <i class="fas fa-chevron-left"></i> Previous
        </button>
    `;

    // Page numbers
    for (let i = 1; i <= pagination.pages; i++) {
        if (i === 1 || i === pagination.pages || (i >= pagination.page - 2 && i <= pagination.page + 2)) {
            paginationHTML += `
                <button class="${i === pagination.page ? 'active' : ''}" onclick="loadTodos(${i})">
                    ${i}
                </button>
            `;
        } else if (i === pagination.page - 3 || i === pagination.page + 3) {
            paginationHTML += '<span>...</span>';
        }
    }

    // Next button
    paginationHTML += `
        <button ${pagination.page >= pagination.pages ? 'disabled' : ''} onclick="loadTodos(${pagination.page + 1})">
            Next <i class="fas fa-chevron-right"></i>
        </button>
    `;

    paginationElement.innerHTML = paginationHTML;
}

async function updateTodoStatus(todoId, status) {
    try {
        const response = await fetch(`${API_BASE}/todos/${todoId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ status })
        });

        const data = await response.json();

        if (data.success) {
            showToast(`Todo status updated to ${status.replace('_', ' ')}`, 'success');
            loadTodos(currentPage);
        } else {
            showToast(data.message || 'Failed to update status', 'error');
        }
    } catch (error) {
        showToast('An error occurred while updating status', 'error');
        console.error('Update status error:', error);
    }
}

async function deleteTodo(todoId) {
    if (!confirm('Are you sure you want to delete this todo?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/todos/${todoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();

        if (data.success) {
            showToast('Todo deleted successfully!', 'success');
            loadTodos(currentPage);
        } else {
            showToast(data.message || 'Failed to delete todo', 'error');
        }
    } catch (error) {
        showToast('An error occurred while deleting todo', 'error');
        console.error('Delete todo error:', error);
    }
}

async function editTodo(todoId) {
    try {
        showLoading(true);
        // Fetch the todo details to populate the form
        const response = await fetch(`${API_BASE}/todos/${todoId}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const data = await response.json();
        if (!data.success) {
            showToast(data.message || 'Failed to load todo for editing', 'error');
            return;
        }

        const todo = data.data;

        // Populate form fields
        document.getElementById('todoTitle').value = todo.title || '';
        document.getElementById('todoDescription').value = todo.description || '';
        document.getElementById('todoPriority').value = todo.priority || 'medium';
        document.getElementById('todoDueDate').value = todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0,10) : '';
        document.getElementById('todoTags').value = Array.isArray(todo.tags) ? todo.tags.join(', ') : '';

        // Switch to edit mode
        isEditMode = true;
        editingTodoId = todoId;
        todoSubmitBtn.textContent = 'Update Todo';

        // Show the form
        showAddTodoForm();
    } catch (err) {
        console.error('Edit todo load error:', err);
        showToast('An error occurred while loading todo', 'error');
    } finally {
        showLoading(false);
    }
}

// Filter and Search Functions
function handleSearch(e) {
    const searchTerm = e.target.value.trim();
    currentFilters.search = searchTerm || undefined;
    loadTodos(1);
}

function handleFilterChange() {
    const statusFilter = document.getElementById('statusFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;

    currentFilters.status = statusFilter || undefined;
    currentFilters.priority = priorityFilter || undefined;
    
    loadTodos(1);
}

// Utility Functions
function showAuthForms() {
    authForms.style.display = 'block';
    todoApp.style.display = 'none';
    userInfo.style.display = 'none';
}

function showTodoApp() {
    authForms.style.display = 'none';
    todoApp.style.display = 'block';
    userInfo.style.display = 'flex';
    username.textContent = currentUser.username;
}

function showLoginForm() {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
}

function showRegisterForm() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
}

function showLoading(show) {
    loading.style.display = show ? 'flex' : 'none';
}

function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
