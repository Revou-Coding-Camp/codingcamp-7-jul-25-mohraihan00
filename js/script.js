class PlantGarden {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.plantStages = [
            { emoji: '🌱', name: 'Young Sprout', water: 0 },
            { emoji: '🌿', name: 'Growing Plant', water: 5 },
            { emoji: '🌳', name: 'Small Tree', water: 12 },
            { emoji: '🌲', name: 'Mature Tree', water: 20 },
            { emoji: '🌳🍎', name: 'Fruit Tree', water: 30 }
        ];
        this.currentStage = 0;
        this.waterLevel = 0;
        this.harvestCount = 0;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateDisplay();
        this.setTodayDate();
    }
    
    setupEventListeners() {
        document.getElementById('addTaskBtn').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        
        document.getElementById('deleteAllBtn').addEventListener('click', () => this.deleteAllTasks());
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });
    }
    
    setTodayDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('dateInput').value = today;
    }
    
    addTask() {
        const taskInput = document.getElementById('taskInput');
        const dateInput = document.getElementById('dateInput');
        
        if (taskInput.value.trim() === '') return;
        
        const task = {
            id: Date.now(),
            text: taskInput.value.trim(),
            date: dateInput.value || new Date().toISOString().split('T')[0],
            completed: false,
            createdAt: new Date()
        };
        
        this.tasks.push(task);
        taskInput.value = '';
        this.updateDisplay();
    }
    
    deleteAllTasks() {
        if (this.tasks.length === 0) return;
        
        if (confirm('Are you sure you want to delete all tasks?')) {
            this.tasks = [];
            this.waterLevel = 0;
            this.currentStage = 0;
            this.updateDisplay();
        }
    }
    
    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            
            if (task.completed) {
                this.waterLevel++;
                this.checkPlantGrowth();
                this.showWaterDrop();
            } else {
                this.waterLevel = Math.max(0, this.waterLevel - 1);
            }
            
            this.updateDisplay();
        }
    }
    
    deleteTask(id) {
        const taskIndex = this.tasks.findIndex(t => t.id === id);
        if (taskIndex > -1) {
            const task = this.tasks[taskIndex];
            if (task.completed) {
                this.waterLevel = Math.max(0, this.waterLevel - 1);
            }
            this.tasks.splice(taskIndex, 1);
            this.updateDisplay();
        }
    }
    
    checkPlantGrowth() {
        const nextStage = this.currentStage + 1;
        if (nextStage < this.plantStages.length && 
            this.waterLevel >= this.plantStages[nextStage].water) {
            this.currentStage = nextStage;
            this.showGrowthAnimation();
            
            if (this.currentStage === this.plantStages.length - 1) {
                setTimeout(() => this.triggerHarvest(), 1000);
            }
        }
    }
    
    triggerHarvest() {
        this.harvestCount++;
        this.showHarvestCelebration();
        
        setTimeout(() => {
            this.resetPlant();
        }, 3000);
    }
    
    showHarvestCelebration() {
        const plantDisplay = document.getElementById('plantDisplay');
        const plantContainer = plantDisplay.parentElement;
        
        plantDisplay.classList.add('harvest-celebration');
        
        const celebrationText = document.createElement('div');
        celebrationText.className = 'celebration-text absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 text-2xl font-bold text-yellow-600 z-20';
        celebrationText.textContent = '🎉 Harvest Complete! 🎉';
        plantContainer.appendChild(celebrationText);
        
        this.createFloatingFruits();
        
        setTimeout(() => {
            plantDisplay.classList.remove('harvest-celebration');
            celebrationText.remove();
        }, 2000);
    }
    
    createFloatingFruits() {
        const fruits = ['🍎', '🍊', '🍌', '🍇', '🥭', '🍓'];
        const plantContainer = document.getElementById('plantDisplay').parentElement;
        
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const fruit = document.createElement('div');
                fruit.className = 'floating-fruits absolute text-2xl z-20';
                fruit.textContent = fruits[Math.floor(Math.random() * fruits.length)];
                
                // Random position for the plant
                const angle = (i * 60) * Math.PI / 180;
                const radius = 50;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                fruit.style.left = `calc(50% + ${x}px)`;
                fruit.style.top = `calc(50% + ${y}px)`;
                fruit.style.transform = 'translate(-50%, -50%)';
                
                plantContainer.appendChild(fruit);
                
                setTimeout(() => {
                    fruit.remove();
                }, 2000);
            }, i * 100);
        }
    }
    
    resetPlant() {
        this.currentStage = 0;
        this.waterLevel = 0;
        
        const plantContainer = document.querySelector('.plant-container');
        plantContainer.classList.add('reset-glow');
        
        const harvestCounter = document.getElementById('harvestCounter');
        harvestCounter.style.display = 'block';
        
        setTimeout(() => {
            plantContainer.classList.remove('reset-glow');
        }, 1000);
        
        this.updateDisplay();
    }
    
    showGrowthAnimation() {
        const plantDisplay = document.getElementById('plantDisplay');
        plantDisplay.classList.add('growth-animation');
        setTimeout(() => {
            plantDisplay.classList.remove('growth-animation');
        }, 800);
    }
    
    showWaterDrop() {
        const plantDisplay = document.getElementById('plantDisplay');
        const waterDrop = document.createElement('div');
        waterDrop.textContent = '💧';
        waterDrop.className = 'water-drop absolute text-2xl z-20';
        waterDrop.style.left = '50%';
        waterDrop.style.top = '20px';
        waterDrop.style.transform = 'translateX(-50%)';
        
        plantDisplay.parentElement.style.position = 'relative';
        plantDisplay.parentElement.appendChild(waterDrop);
        
        setTimeout(() => {
            waterDrop.remove();
        }, 600);
    }
    
    setFilter(filter) {
        this.currentFilter = filter;
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.updateDisplay();
    }
    
    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }
    
    updateDisplay() {
        this.updatePlantDisplay();
        this.updateTaskList();
        this.updateStats();
    }
    
    updatePlantDisplay() {
        const stage = this.plantStages[this.currentStage];
        const nextStage = this.plantStages[this.currentStage + 1];
        
        document.getElementById('plantDisplay').textContent = stage.emoji;
        document.getElementById('plantStatus').textContent = stage.name;
        document.getElementById('harvestCount').textContent = this.harvestCount;
        
        if (nextStage) {
            const progress = ((this.waterLevel - stage.water) / (nextStage.water - stage.water)) * 100;
            document.getElementById('waterProgress').style.width = `${Math.min(100, Math.max(0, progress))}%`;
            document.getElementById('currentWater').textContent = this.waterLevel;
            document.getElementById('requiredWater').textContent = nextStage.water;
        } else {
            document.getElementById('waterProgress').style.width = '100%';
            document.getElementById('currentWater').textContent = this.waterLevel;
            document.getElementById('requiredWater').textContent = 'MAX';
        }
    }
    
    updateTaskList() {
        const taskList = document.getElementById('taskList');
        const filteredTasks = this.getFilteredTasks();
        
        taskList.innerHTML = '';
        
        if (filteredTasks.length === 0) {
            taskList.innerHTML = `
                <div class="text-center text-secondary py-8">
                    <div class="text-4xl mb-2">🌸</div>
                    <div>No tasks yet. Add one to start growing!</div>
                </div>
            `;
            return;
        }
        
        filteredTasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item glass-dark rounded-lg p-4 flex items-center justify-between ${task.completed ? 'completed-task' : ''}`;
            
            taskElement.innerHTML = `
                <div class="flex items-center gap-3 relative z-10">
                    <input 
                        type="checkbox" 
                        ${task.completed ? 'checked' : ''} 
                        class="w-5 h-5 rounded text-green-500 focus:ring-green-400"
                        onchange="garden.toggleTask(${task.id})"
                    >
                    <div>
                        <div class="text-primary font-medium">${task.text}</div>
                        <div class="text-secondary text-sm">${new Date(task.date).toLocaleDateString()}</div>
                    </div>
                </div>
                <button 
                    onclick="garden.deleteTask(${task.id})"
                    class="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-100/50 transition-colors relative z-10"
                >
                    🗑️
                </button>
            `;
            
            taskList.appendChild(taskElement);
        });
    }
    
    updateStats() {
        const completedCount = this.tasks.filter(task => task.completed).length;
        
        document.getElementById('totalTasks').textContent = this.tasks.length;
        document.getElementById('completedTasks').textContent = completedCount;
    }
}

const backToTopBtn = document.getElementById('backToTopBtn');

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

const garden = new PlantGarden();