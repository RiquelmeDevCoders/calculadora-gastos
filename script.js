document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const expenseForm = document.getElementById('add-expense');
    const expenseValueInput = document.getElementById('expense-value');
    const expenseCategorySelect = document.getElementById('expense-category');
    const expenseDescriptionInput = document.getElementById('expense-description');
    const monthlyLimitInput = document.getElementById('monthly-limit');
    const totalSpentElement = document.getElementById('total-spent');
    const limitDisplayElement = document.getElementById('limit-display');
    const remainingElement = document.getElementById('remaining');
    const expensesContainer = document.getElementById('expenses-container');
    const filterCategorySelect = document.getElementById('filter-category');
    
    
    let expenses = [];
    let monthlyLimit = 0;
    
    
    loadData();
    
    
    updateUI();
    
    
    expenseForm.addEventListener('click', addExpense);
    monthlyLimitInput.addEventListener('change', updateMonthlyLimit);
    filterCategorySelect.addEventListener('change', filterExpenses);
    
    
    function addExpense() {
        const value = parseFloat(expenseValueInput.value);
        const category = expenseCategorySelect.value;
        const description = expenseDescriptionInput.value.trim();
        
        
        if (isNaN(value) || value <= 0) {
            alert('Por favor, insira um valor válido maior que zero.');
            return;
        }
        
        if (!category) {
            alert('Por favor, selecione uma categoria.');
            return;
        }
        
        
        const newExpense = {
            id: Date.now(),
            value: value,
            category: category,
            description: description,
            date: new Date().toLocaleDateString()
        };
        
        
        expenses.push(newExpense);
        
        
        saveData();
        
        
        updateUI();
        
        
        expenseValueInput.value = '';
        expenseDescriptionInput.value = '';
        expenseValueInput.focus();
        
        
        checkLimit();
    }
    
    
    function updateMonthlyLimit() {
        const newLimit = parseFloat(monthlyLimitInput.value);
        
        if (isNaN(newLimit)) {
            alert('Por favor, insira um valor válido para o limite mensal.');
            monthlyLimitInput.value = monthlyLimit;
            return;
        }
        
        monthlyLimit = newLimit;
        saveData();
        updateUI();
        checkLimit();
    }
    
    
    function filterExpenses() {
        const selectedCategory = filterCategorySelect.value;
        
        if (selectedCategory === 'todos') {
            renderExpenses(expenses);
        } else {
            const filteredExpenses = expenses.filter(expense => expense.category === selectedCategory);
            renderExpenses(filteredExpenses);
        }
    }
    
    
    function removeExpense(id) {
        expenses = expenses.filter(expense => expense.id !== id);
        saveData();
        updateUI();
    }
    
    
    function updateUI() {
        
        const totalSpent = expenses.reduce((sum, expense) => sum + expense.value, 0);
        
        
        totalSpentElement.textContent = totalSpent.toFixed(2);
        limitDisplayElement.textContent = monthlyLimit.toFixed(2);
        
        
        const remaining = monthlyLimit - totalSpent;
        remainingElement.textContent = Math.max(0, remaining).toFixed(2);
        
        
        if (remaining < 0) {
            remainingElement.classList.add('over-limit');
        } else {
            remainingElement.classList.remove('over-limit');
        }
        
        
        renderExpenses(expenses);
    }
    
    
    function renderExpenses(expensesToRender) {
        expensesContainer.innerHTML = '';
        
        if (expensesToRender.length === 0) {
            expensesContainer.innerHTML = '<p>Nenhum gasto registrado ainda.</p>';
            return;
        }
        
        expensesToRender.forEach(expense => {
            const expenseElement = document.createElement('div');
            expenseElement.className = 'expense-item';
            
            
            const categoryNames = {
                'alimentacao': 'Alimentação',
                'transporte': 'Transporte',
                'lazer': 'Lazer',
                'moradia': 'Moradia',
                'saude': 'Saúde',
                'educacao': 'Educação',
                'outros': 'Outros'
            };
            
            const categoryName = categoryNames[expense.category] || expense.category;
            
            expenseElement.innerHTML = `
                <div>
                    <strong>R$ ${expense.value.toFixed(2)}</strong> - ${categoryName}
                    ${expense.description ? `<br><small>${expense.description}</small>` : ''}
                    <br><small>${expense.date}</small>
                </div>
                <button class="delete-btn" data-id="${expense.id}">×</button>
            `;
            
            expensesContainer.appendChild(expenseElement);
        });
        
        
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                removeExpense(id);
            });
        });
    }
    
    
    function checkLimit() {
        const totalSpent = expenses.reduce((sum, expense) => sum + expense.value, 0);
        
        if (monthlyLimit > 0 && totalSpent > monthlyLimit) {
            alert('ATENÇÃO: Você ultrapassou seu limite mensal!');
        }
    }
    
    
    function saveData() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
        localStorage.setItem('monthlyLimit', monthlyLimit.toString());
    }
    
    function loadData() {
        const savedExpenses = localStorage.getItem('expenses');
        const savedLimit = localStorage.getItem('monthlyLimit');
        
        if (savedExpenses) {
            expenses = JSON.parse(savedExpenses);
        }
        
        if (savedLimit) {
            monthlyLimit = parseFloat(savedLimit);
            monthlyLimitInput.value = monthlyLimit;
        }
    }
});