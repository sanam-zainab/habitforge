// HabitForge - Main Application Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    // DOM Elements
    const elements = {
        loadingScreen: document.getElementById('loadingScreen'),
        newHabitBtn: document.getElementById('newHabitBtn'),
        habitModal: document.getElementById('habitModal'),
        closeModal: document.getElementById('closeModal'),
        cancelModal: document.getElementById('cancelModal'),
        createHabit: document.getElementById('createHabit'),
        habitForm: document.getElementById('habitForm'),
        habitsContainer: document.getElementById('habitsContainer'),
        emptyState: document.getElementById('emptyState'),
        startFirstHabit: document.getElementById('startFirstHabit'),
        currentStreak: document.getElementById('currentStreak'),
        activeHabits: document.getElementById('activeHabits'),
        completionRate: document.getElementById('completionRate'),
        streakFlame: document.getElementById('streakFlame'),
        streakDays: document.getElementById('streakDays'),
        streakMessage: document.getElementById('streakMessage'),
        refreshQuote: document.getElementById('refreshQuote'),
        dailyQuote: document.getElementById('dailyQuote'),
        quoteAuthor: document.getElementById('quoteAuthor'),
        achievementsList: document.getElementById('achievementsList'),
        markAllToday: document.getElementById('markAllToday'),
        exportData: document.getElementById('exportData'),
        importData: document.getElementById('importData'),
        resetData: document.getElementById('resetData'),
        darkModeToggle: document.getElementById('darkModeToggle'),
        toast: document.getElementById('toast'),
        currentMonth: document.getElementById('currentMonth'),
        calendarGrid: document.getElementById('calendarGrid'),
        prevMonth: document.getElementById('prevMonth'),
        nextMonth: document.getElementById('nextMonth'),
        viewButtons: document.querySelectorAll('.view-btn')
    };
    
    console.log('DOM elements collected:', Object.keys(elements).length);
    
    // App State
    let state = {
        habits: [],
        currentDate: new Date(),
        selectedMonth: new Date(),
        achievements: [],
        quotes: [
            { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
            { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
            { text: "Small daily improvements are the key to staggering long-term results.", author: "Robin Sharma" },
            { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
            { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
            { text: "The harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
            { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
            { text: "The best way to predict your future is to create it.", author: "Abraham Lincoln" }
        ],
        colors: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336'],
        icons: ['fa-glass-water', 'fa-dumbbell', 'fa-book', 'fa-meditation', 'fa-code', 'fa-moon', 'fa-apple-alt', 'fa-running']
    };
    
    // Initialize the application
    function initApp() {
        console.log('Initializing application...');
        
        // Show loading screen briefly
        setTimeout(() => {
            if (elements.loadingScreen) {
                elements.loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    elements.loadingScreen.style.display = 'none';
                    console.log('Loading screen hidden');
                }, 500);
            }
        }, 1000); // Reduced from 1500ms
        
        // Load data from localStorage
        loadData();
        
        // Set up event listeners
        setupEventListeners();
        
        // Generate initial quote
        generateRandomQuote();
        
        // Generate calendar
        generateCalendar();
        
        // Set initial view
        setView('grid');
        
        // Update UI
        updateUI();
        
        console.log('Application initialized successfully');
    }
    
    // Set up all event listeners
    function setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Modal controls
        if (elements.newHabitBtn) elements.newHabitBtn.addEventListener('click', openModal);
        if (elements.closeModal) elements.closeModal.addEventListener('click', closeModal);
        if (elements.cancelModal) elements.cancelModal.addEventListener('click', closeModal);
        if (elements.startFirstHabit) elements.startFirstHabit.addEventListener('click', openModal);
        if (elements.createHabit) elements.createHabit.addEventListener('click', createNewHabit);
        
        // Habit form interactions
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
                this.classList.add('selected');
                document.getElementById('selectedColor').value = this.dataset.color;
            });
        });
        
        document.querySelectorAll('.icon-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.icon-option').forEach(o => o.classList.remove('selected'));
                this.classList.add('selected');
                document.getElementById('selectedIcon').value = this.dataset.icon;
            });
        });
        
        document.querySelectorAll('.frequency-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.frequency-option').forEach(o => o.classList.remove('selected'));
                this.classList.add('selected');
                this.querySelector('input').checked = true;
            });
        });
        
        // Quote refresh
        if (elements.refreshQuote) elements.refreshQuote.addEventListener('click', generateRandomQuote);
        
        // Calendar navigation
        if (elements.prevMonth) elements.prevMonth.addEventListener('click', () => navigateMonth(-1));
        if (elements.nextMonth) elements.nextMonth.addEventListener('click', () => navigateMonth(1));
        
        // View controls
        elements.viewButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const view = this.dataset.view;
                setView(view);
                elements.viewButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Quick actions
        if (elements.markAllToday) elements.markAllToday.addEventListener('click', markAllHabitsToday);
        if (elements.exportData) elements.exportData.addEventListener('click', exportData);
        if (elements.importData) elements.importData.addEventListener('click', importData);
        
        // Footer actions
        if (elements.resetData) elements.resetData.addEventListener('click', resetData);
        if (elements.darkModeToggle) elements.darkModeToggle.addEventListener('click', toggleDarkMode);
        
        // Close modal on outside click
        if (elements.habitModal) {
            elements.habitModal.addEventListener('click', function(e) {
                if (e.target === this) closeModal();
            });
        }
        
        // Allow Enter key to submit form
        if (elements.habitForm) {
            elements.habitForm.addEventListener('submit', function(e) {
                e.preventDefault();
                createNewHabit();
            });
        }
        
        console.log('Event listeners setup complete');
    }
    
    // Load data from localStorage
    function loadData() {
        console.log('Loading data from localStorage...');
        
        try {
            const savedHabits = localStorage.getItem('habitForge_habits');
            const savedAchievements = localStorage.getItem('habitForge_achievements');
            const darkMode = localStorage.getItem('habitForge_darkMode');
            
            if (savedHabits) {
                state.habits = JSON.parse(savedHabits);
                console.log('Loaded habits:', state.habits.length);
            }
            
            if (savedAchievements) {
                state.achievements = JSON.parse(savedAchievements);
                console.log('Loaded achievements:', state.achievements.length);
            }
            
            if (darkMode === 'true') {
                document.body.classList.add('dark-mode');
                if (elements.darkModeToggle) {
                    elements.darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
                }
            }
        } catch (error) {
            console.error('Error loading data:', error);
            // Reset to default state
            state.habits = [];
            state.achievements = [];
        }
    }
    
    // Save data to localStorage
    function saveData() {
        try {
            localStorage.setItem('habitForge_habits', JSON.stringify(state.habits));
            localStorage.setItem('habitForge_achievements', JSON.stringify(state.achievements));
            console.log('Data saved to localStorage');
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }
    
    // Update the UI with current state
    function updateUI() {
        console.log('Updating UI...');
        updateHabitsDisplay();
        updateStats();
        updateStreakDisplay();
        updateAchievements();
        updateProgressBars();
        generateCalendar();
        saveData();
    }
    
    // Update habits display
    function updateHabitsDisplay() {
        if (!elements.habitsContainer) return;
        
        elements.habitsContainer.innerHTML = '';
        
        if (state.habits.length === 0) {
            if (elements.emptyState) {
                elements.emptyState.style.display = 'block';
                elements.habitsContainer.appendChild(elements.emptyState);
            }
            return;
        }
        
        if (elements.emptyState) {
            elements.emptyState.style.display = 'none';
        }
        
        state.habits.forEach((habit, index) => {
            const habitCard = createHabitCard(habit, index);
            elements.habitsContainer.appendChild(habitCard);
        });
    }
    
    // Create a habit card element
    function createHabitCard(habit, index) {
        const today = new Date().toDateString();
        const isCompletedToday = habit.completions.includes(today);
        const isSkippedToday = habit.skipped.includes(today);
        const completionRate = calculateCompletionRate(habit);
        
        const card = document.createElement('div');
        card.className = 'habit-card';
        card.style.borderLeftColor = habit.color;
        
        const streak = calculateHabitStreak(habit);
        
        card.innerHTML = `
            <div class="habit-header">
                <div class="habit-icon" style="background-color: ${habit.color}20; color: ${habit.color}">
                    <i class="fas ${habit.icon}"></i>
                </div>
                <div class="habit-title">
                    <h3>${habit.name}</h3>
                    <span class="habit-category" style="background-color: ${habit.color}20; color: ${habit.color}">
                        ${habit.category}
                    </span>
                </div>
                <button class="btn-delete-habit" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="habit-stats">
                <div class="stat">
                    <span class="stat-value">${streak}</span>
                    <span class="stat-label">Day Streak</span>
                </div>
                <div class="stat">
                    <div class="progress-ring">
                        <svg width="80" height="80">
                            <circle class="progress-ring-circle" cx="40" cy="40" r="36" 
                                    stroke="${habit.color}" 
                                    stroke-dasharray="226" 
                                    stroke-dashoffset="${226 - (completionRate * 226)}">
                            </circle>
                        </svg>
                    </div>
                    <span class="stat-label">${Math.round(completionRate * 100)}%</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${habit.completions.length}</span>
                    <span class="stat-label">Total Done</span>
                </div>
            </div>
            
            ${habit.goal ? `<div class="habit-goal">
                <p><i class="fas fa-bullseye"></i> Goal: ${habit.goal}</p>
                <div class="goal-progress">
                    <div class="progress-track">
                        <div class="progress-fill" style="width: ${Math.min((streak / parseInt(habit.goal) * 100), 100)}%; background: ${habit.color}"></div>
                    </div>
                </div>
            </div>` : ''}
            
            <div class="habit-actions">
                <button class="btn-complete ${isCompletedToday ? 'completed' : ''}" 
                        data-index="${index}" 
                        style="background: ${isCompletedToday ? '#4CAF50' : `linear-gradient(45deg, ${habit.color}, ${habit.color}AA)`}">
                    <i class="fas ${isCompletedToday ? 'fa-check' : 'fa-check-circle'}"></i>
                    ${isCompletedToday ? 'Completed' : 'Mark Complete'}
                </button>
                <button class="btn-skip ${isSkippedToday ? 'skipped' : ''}" data-index="${index}">
                    <i class="fas ${isSkippedToday ? 'fa-undo' : 'fa-forward'}"></i>
                    ${isSkippedToday ? 'Undo Skip' : 'Skip Today'}
                </button>
            </div>
        `;
        
        // Add event listeners to buttons
        setTimeout(() => {
            const completeBtn = card.querySelector('.btn-complete');
            const skipBtn = card.querySelector('.btn-skip');
            const deleteBtn = card.querySelector('.btn-delete-habit');
            
            if (completeBtn) completeBtn.addEventListener('click', () => toggleHabitCompletion(index));
            if (skipBtn) skipBtn.addEventListener('click', () => toggleHabitSkip(index));
            if (deleteBtn) deleteBtn.addEventListener('click', () => deleteHabit(index));
        }, 0);
        
        return card;
    }
    
    // Calculate completion rate for a habit
    function calculateCompletionRate(habit) {
        try {
            const createdDate = new Date(habit.createdAt);
            const daysSinceCreation = Math.ceil((new Date() - createdDate) / (1000 * 60 * 60 * 24));
            const expectedCompletions = Math.min(daysSinceCreation, habit.completions.length + habit.skipped.length);
            
            if (expectedCompletions === 0) return 0;
            return habit.completions.length / expectedCompletions;
        } catch (error) {
            console.error('Error calculating completion rate:', error);
            return 0;
        }
    }
    
    // Calculate streak for a habit
    function calculateHabitStreak(habit) {
        try {
            if (!habit.completions || habit.completions.length === 0) return 0;
            
            const dates = habit.completions.map(date => new Date(date).setHours(0, 0, 0, 0)).sort((a, b) => b - a);
            let streak = 0;
            const day = 1000 * 60 * 60 * 24;
            const today = new Date().setHours(0, 0, 0, 0);
            
            // Check if most recent completion is today
            if (dates[0] === today) {
                streak = 1;
                let prevDate = dates[0] - day;
                
                // Check consecutive previous days
                for (let i = 1; i < dates.length; i++) {
                    if (dates[i] === prevDate) {
                        streak++;
                        prevDate -= day;
                    } else {
                        break;
                    }
                }
            }
            
            return streak;
        } catch (error) {
            console.error('Error calculating habit streak:', error);
            return 0;
        }
    }
    
    // Calculate overall streak
    function calculateOverallStreak() {
        if (state.habits.length === 0) return 0;
        
        try {
            const streaks = state.habits.map(habit => calculateHabitStreak(habit));
            return Math.max(...streaks);
        } catch (error) {
            console.error('Error calculating overall streak:', error);
            return 0;
        }
    }
    
    // Update statistics
    function updateStats() {
        try {
            const overallStreak = calculateOverallStreak();
            const activeHabitsCount = state.habits.length;
            
            let totalCompletionRate = 0;
            state.habits.forEach(habit => {
                totalCompletionRate += calculateCompletionRate(habit);
            });
            const avgCompletionRate = state.habits.length > 0 ? Math.round((totalCompletionRate / state.habits.length) * 100) : 0;
            
            if (elements.currentStreak) elements.currentStreak.textContent = overallStreak;
            if (elements.activeHabits) elements.activeHabits.textContent = activeHabitsCount;
            if (elements.completionRate) elements.completionRate.textContent = `${avgCompletionRate}%`;
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }
    
    // Update streak display with flame animation
    function updateStreakDisplay() {
        try {
            const streak = calculateOverallStreak();
            if (elements.streakDays) elements.streakDays.textContent = streak;
            
            // Update flame size based on streak
            if (elements.streakFlame) {
                const flameInner = elements.streakFlame.querySelector('.flame-inner');
                const flameMiddle = elements.streakFlame.querySelector('.flame-middle');
                const flameOuter = elements.streakFlame.querySelector('.flame-outer');
                
                if (flameInner && flameMiddle && flameOuter) {
                    const baseSize = 80;
                    const sizeMultiplier = 1 + Math.min(streak / 100, 0.5);
                    
                    flameInner.style.width = `${40 * sizeMultiplier}px`;
                    flameInner.style.height = `${80 * sizeMultiplier}px`;
                    flameMiddle.style.width = `${50 * sizeMultiplier}px`;
                    flameMiddle.style.height = `${90 * sizeMultiplier}px`;
                    flameOuter.style.width = `${60 * sizeMultiplier}px`;
                    flameOuter.style.height = `${100 * sizeMultiplier}px`;
                }
            }
            
            // Update streak message
            if (elements.streakMessage) {
                let message = "";
                if (streak === 0) {
                    message = "Start your journey! Complete a habit to ignite your flame!";
                } else if (streak < 7) {
                    message = "Great start! Your flame is growing!";
                } else if (streak < 30) {
                    message = "Amazing! You're building a strong fire!";
                } else if (streak < 100) {
                    message = "Incredible! Your dedication is blazing hot!";
                } else {
                    message = "Legendary! Your streak is an inferno of success!";
                }
                elements.streakMessage.textContent = message;
            }
        } catch (error) {
            console.error('Error updating streak display:', error);
        }
    }
    
    // Update achievements display
    function updateAchievements() {
        if (!elements.achievementsList) return;
        
        elements.achievementsList.innerHTML = '';
        
        // Check for new achievements
        checkForAchievements();
        
        // Display recent achievements (last 3)
        const recentAchievements = state.achievements.slice(-3).reverse();
        
        if (recentAchievements.length === 0) {
            elements.achievementsList.innerHTML = '<p class="no-achievements">No achievements yet. Keep going!</p>';
            return;
        }
        
        recentAchievements.forEach(achievement => {
            const achievementEl = document.createElement('div');
            achievementEl.className = 'achievement';
            achievementEl.innerHTML = `
                <i class="fas fa-trophy"></i>
                <div>
                    <strong>${achievement.title}</strong>
                    <small>${new Date(achievement.date).toLocaleDateString()}</small>
                </div>
            `;
            elements.achievementsList.appendChild(achievementEl);
        });
    }
    
    // Check for new achievements
    function checkForAchievements() {
        try {
            const streak = calculateOverallStreak();
            const totalCompletions = state.habits.reduce((sum, habit) => sum + (habit.completions ? habit.completions.length : 0), 0);
            
            const achievementChecks = [
                { condition: streak >= 1, title: "First Flame", description: "Completed your first daily habit" },
                { condition: streak >= 7, title: "Week Warrior", description: "7-day streak achieved" },
                { condition: streak >= 30, title: "Monthly Master", description: "30-day streak achieved" },
                { condition: state.habits.length >= 5, title: "Habit Collector", description: "Created 5 habits" },
                { condition: totalCompletions >= 50, title: "Consistency King/Queen", description: "50 total habit completions" },
                { condition: state.habits.length > 0 && state.habits.every(h => calculateCompletionRate(h) >= 0.8), 
                  title: "Perfect Balance", description: "All habits above 80% completion" }
            ];
            
            achievementChecks.forEach(check => {
                if (check.condition && !state.achievements.some(a => a.title === check.title)) {
                    state.achievements.push({
                        title: check.title,
                        description: check.description,
                        date: new Date().toISOString()
                    });
                    
                    // Show achievement notification
                    showToast(`🎉 Achievement Unlocked: ${check.title}!`);
                }
            });
        } catch (error) {
            console.error('Error checking achievements:', error);
        }
    }
    
    // Update progress bars
    function updateProgressBars() {
        if (!elements.progressBars) return;
        
        elements.progressBars.innerHTML = '';
        
        if (state.habits.length === 0) {
            elements.progressBars.innerHTML = '<p>Add habits to see weekly progress</p>';
            return;
        }
        
        // Calculate weekly progress for each habit (max 3)
        const habitsToShow = state.habits.slice(0, 3);
        const last7Days = Array.from({length: 7}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toDateString();
        }).reverse();
        
        habitsToShow.forEach(habit => {
            const weeklyCompletions = last7Days.filter(day => 
                habit.completions && habit.completions.includes(day)
            ).length;
            
            const progress = Math.round((weeklyCompletions / 7) * 100);
            
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            progressBar.innerHTML = `
                <div class="progress-label">
                    <span>${habit.name}</span>
                    <span>${weeklyCompletions}/7 days</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${progress}%; background: ${habit.color}"></div>
                </div>
            `;
            
            elements.progressBars.appendChild(progressBar);
        });
    }
    
    // Generate calendar
    function generateCalendar() {
        if (!elements.currentMonth || !elements.calendarGrid) return;
        
        try {
            const year = state.selectedMonth.getFullYear();
            const month = state.selectedMonth.getMonth();
            
            // Get month name
            const monthName = state.selectedMonth.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
            });
            elements.currentMonth.textContent = monthName;
            
            // Get first day of month
            const firstDay = new Date(year, month, 1);
            // Get last day of month
            const lastDay = new Date(year, month + 1, 0);
            // Get number of days in month
            const daysInMonth = lastDay.getDate();
            // Get day of week for first day (0 = Sunday, 6 = Saturday)
            const firstDayIndex = firstDay.getDay();
            
            elements.calendarGrid.innerHTML = '';
            
            // Day headers
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            days.forEach(day => {
                const dayEl = document.createElement('div');
                dayEl.className = 'day-header';
                dayEl.textContent = day;
                elements.calendarGrid.appendChild(dayEl);
            });
            
            // Empty cells for days before first day of month
            for (let i = 0; i < firstDayIndex; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'day-cell empty';
                elements.calendarGrid.appendChild(emptyCell);
            }
            
            // Days of the month
            const today = new Date();
            const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
            
            for (let day = 1; day <= daysInMonth; day++) {
                const dayEl = document.createElement('div');
                dayEl.className = 'day-cell';
                dayEl.textContent = day;
                
                const dateStr = new Date(year, month, day).toDateString();
                
                // Check if any habits were completed on this day
                const completionsOnDay = state.habits.filter(habit => 
                    habit.completions && habit.completions.includes(dateStr)
                ).length;
                
                const skipsOnDay = state.habits.filter(habit => 
                    habit.skipped && habit.skipped.includes(dateStr)
                ).length;
                
                if (completionsOnDay > 0) {
                    dayEl.classList.add('completed');
                    dayEl.title = `${completionsOnDay} habit${completionsOnDay > 1 ? 's' : ''} completed`;
                } else if (skipsOnDay > 0) {
                    dayEl.classList.add('skipped');
                    dayEl.title = `${skipsOnDay} habit${skipsOnDay > 1 ? 's' : ''} skipped`;
                }
                
                // Highlight today
                if (isCurrentMonth && day === today.getDate()) {
                    dayEl.classList.add('today');
                }
                
                elements.calendarGrid.appendChild(dayEl);
            }
        } catch (error) {
            console.error('Error generating calendar:', error);
            elements.calendarGrid.innerHTML = '<p>Error loading calendar</p>';
        }
    }
    
    // Navigate calendar months
    function navigateMonth(direction) {
        state.selectedMonth.setMonth(state.selectedMonth.getMonth() + direction);
        generateCalendar();
    }
    
    // Set view mode (grid/list)
    function setView(mode) {
        if (!elements.habitsContainer) return;
        
        if (mode === 'grid') {
            elements.habitsContainer.classList.remove('list-view');
        } else {
            elements.habitsContainer.classList.add('list-view');
        }
    }
    
    // Generate random motivational quote
    function generateRandomQuote() {
        try {
            const randomIndex = Math.floor(Math.random() * state.quotes.length);
            const quote = state.quotes[randomIndex];
            
            if (elements.dailyQuote) elements.dailyQuote.textContent = `"${quote.text}"`;
            if (elements.quoteAuthor) elements.quoteAuthor.textContent = `– ${quote.author}`;
        } catch (error) {
            console.error('Error generating quote:', error);
        }
    }
    
    // Open new habit modal
    function openModal() {
        try {
            // Reset form
            if (elements.habitForm) elements.habitForm.reset();
            
            // Set default selections
            const defaultColor = document.querySelector('.color-option[data-color="#4CAF50"]');
            const defaultIcon = document.querySelector('.icon-option[data-icon="fa-glass-water"]');
            const defaultFrequency = document.querySelector('.frequency-option input[value="daily"]');
            
            if (defaultColor) {
                document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
                defaultColor.classList.add('selected');
                document.getElementById('selectedColor').value = '#4CAF50';
            }
            
            if (defaultIcon) {
                document.querySelectorAll('.icon-option').forEach(o => o.classList.remove('selected'));
                defaultIcon.classList.add('selected');
                document.getElementById('selectedIcon').value = 'fa-glass-water';
            }
            
            if (defaultFrequency) {
                document.querySelectorAll('.frequency-option').forEach(o => o.classList.remove('selected'));
                defaultFrequency.parentElement.classList.add('selected');
                defaultFrequency.checked = true;
            }
            
            if (elements.habitModal) {
                elements.habitModal.style.display = 'flex';
            }
            
            // Focus on habit name input
            setTimeout(() => {
                const habitNameInput = document.getElementById('habitName');
                if (habitNameInput) habitNameInput.focus();
            }, 100);
        } catch (error) {
            console.error('Error opening modal:', error);
        }
    }
    
    // Close modal
    function closeModal() {
        if (elements.habitModal) {
            elements.habitModal.style.display = 'none';
        }
        if (elements.habitForm) {
            elements.habitForm.reset();
        }
    }
    
    // Create new habit
    function createNewHabit() {
        try {
            const name = document.getElementById('habitName')?.value?.trim();
            const category = document.getElementById('habitCategory')?.value || 'health';
            const color = document.getElementById('selectedColor')?.value || '#4CAF50';
            const frequency = document.querySelector('input[name="frequency"]:checked')?.value || 'daily';
            const goal = document.getElementById('habitGoal')?.value?.trim() || '';
            const icon = document.getElementById('selectedIcon')?.value || 'fa-glass-water';
            
            if (!name) {
                alert('Please enter a habit name');
                return;
            }
            
            const newHabit = {
                id: Date.now(),
                name,
                category,
                color,
                frequency,
                goal,
                icon,
                completions: [],
                skipped: [],
                createdAt: new Date().toISOString()
            };
            
            state.habits.push(newHabit);
            updateUI();
            closeModal();
            showToast(`New habit "${name}" created!`);
        } catch (error) {
            console.error('Error creating habit:', error);
            alert('Error creating habit. Please try again.');
        }
    }
    
    // Toggle habit completion
    function toggleHabitCompletion(index) {
        try {
            const habit = state.habits[index];
            const today = new Date().toDateString();
            
            const completionIndex = habit.completions.indexOf(today);
            const skipIndex = habit.skipped.indexOf(today);
            
            if (completionIndex > -1) {
                // Remove completion
                habit.completions.splice(completionIndex, 1);
                showToast(`Undid completion for "${habit.name}"`);
            } else {
                // Add completion
                habit.completions.push(today);
                
                // Remove from skipped if it was there
                if (skipIndex > -1) {
                    habit.skipped.splice(skipIndex, 1);
                }
                
                showToast(`Completed "${habit.name}"! 🔥`);
            }
            
            updateUI();
        } catch (error) {
            console.error('Error toggling habit completion:', error);
        }
    }
    
    // Toggle habit skip
    function toggleHabitSkip(index) {
        try {
            const habit = state.habits[index];
            const today = new Date().toDateString();
            
            const skipIndex = habit.skipped.indexOf(today);
            const completionIndex = habit.completions.indexOf(today);
            
            if (skipIndex > -1) {
                // Remove skip
                habit.skipped.splice(skipIndex, 1);
                showToast(`Removed skip for "${habit.name}"`);
            } else {
                // Add skip
                habit.skipped.push(today);
                
                // Remove from completions if it was there
                if (completionIndex > -1) {
                    habit.completions.splice(completionIndex, 1);
                }
                
                showToast(`Skipped "${habit.name}" for today`);
            }
            
            updateUI();
        } catch (error) {
            console.error('Error toggling habit skip:', error);
        }
    }
    
    // Delete habit
    function deleteHabit(index) {
        try {
            if (confirm(`Are you sure you want to delete "${state.habits[index].name}"?`)) {
                const deletedHabit = state.habits.splice(index, 1)[0];
                showToast(`Deleted "${deletedHabit.name}" habit`);
                updateUI();
            }
        } catch (error) {
            console.error('Error deleting habit:', error);
        }
    }
    
    // Mark all habits for today
    function markAllHabitsToday() {
        try {
            if (state.habits.length === 0) {
                showToast("No habits to mark!");
                return;
            }
            
            const today = new Date().toDateString();
            let markedCount = 0;
            
            state.habits.forEach(habit => {
                // Only mark if not already completed or skipped today
                const isCompleted = habit.completions.includes(today);
                const isSkipped = habit.skipped.includes(today);
                
                if (!isCompleted && !isSkipped) {
                    habit.completions.push(today);
                    markedCount++;
                }
            });
            
            if (markedCount > 0) {
                showToast(`Marked ${markedCount} habit${markedCount > 1 ? 's' : ''} for today! 🎯`);
                updateUI();
            } else {
                showToast("All habits are already marked for today!");
            }
        } catch (error) {
            console.error('Error marking all habits:', error);
        }
    }
    
    // Export data
    function exportData() {
        try {
            const data = {
                habits: state.habits,
                achievements: state.achievements,
                exportedAt: new Date().toISOString()
            };
            
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const url = URL.createObjectURL(dataBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `habitforge-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showToast("Data exported successfully!");
        } catch (error) {
            console.error('Error exporting data:', error);
            showToast("Error exporting data");
        }
    }
    
    // Import data
    function importData() {
        try {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    try {
                        const importedData = JSON.parse(event.target.result);
                        
                        if (confirm("This will replace your current data. Continue?")) {
                            state.habits = importedData.habits || [];
                            state.achievements = importedData.achievements || [];
                            updateUI();
                            showToast("Data imported successfully!");
                        }
                    } catch (error) {
                        console.error('Error parsing imported data:', error);
                        alert("Error importing data. Invalid file format.");
                    }
                };
                
                reader.onerror = function() {
                    alert("Error reading file.");
                };
                
                reader.readAsText(file);
            };
            
            input.click();
        } catch (error) {
            console.error('Error importing data:', error);
        }
    }
    
    // Reset all data
    function resetData() {
        try {
            if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
                state.habits = [];
                state.achievements = [];
                localStorage.removeItem('habitForge_habits');
                localStorage.removeItem('habitForge_achievements');
                updateUI();
                showToast("All data has been reset");
            }
        } catch (error) {
            console.error('Error resetting data:', error);
        }
    }
    
        // Toggle dark mode
    function toggleDarkMode() {
        try {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            
            if (elements.darkModeToggle) {
                if (isDarkMode) {
                    elements.darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
                    localStorage.setItem('habitForge_darkMode', 'true');
                } else {
                    elements.darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
                    localStorage.setItem('habitForge_darkMode', 'false');
                }
            }
        } catch (error) {
            console.error('Error toggling dark mode:', error);
        }
    }
    
    // Show toast notification
    function showToast(message) {
        try {
            const toastMessage = elements.toast?.querySelector('.toast-message');
            if (!toastMessage) return;
            
            toastMessage.textContent = message;
            
            if (elements.toast) {
                elements.toast.style.display = 'flex';
                
                // Hide after 3 seconds
                setTimeout(() => {
                    elements.toast.style.display = 'none';
                }, 3000);
            }
        } catch (error) {
            console.error('Error showing toast:', error);
        }
    }
    
    // Initialize with some sample habits if empty
    function initializeSampleHabits() {
        if (state.habits.length === 0) {
            console.log('Initializing sample habits...');
            state.habits = [
                {
                    id: 1,
                    name: "Drink 8 glasses of water",
                    category: "health",
                    color: "#2196F3",
                    frequency: "daily",
                    goal: "30 days streak",
                    icon: "fa-glass-water",
                    completions: getRecentDates(5), // Sample: completed 5 of last 7 days
                    skipped: [],
                    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // Created 7 days ago
                },
                {
                    id: 2,
                    name: "30 minutes of exercise",
                    category: "health",
                    color: "#4CAF50",
                    frequency: "daily",
                    goal: "",
                    icon: "fa-dumbbell",
                    completions: getRecentDates(3), // Sample: completed 3 of last 7 days
                    skipped: getRecentDates(2, true), // Sample: skipped 2 days
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // Created 5 days ago
                },
                {
                    id: 3,
                    name: "Read 10 pages",
                    category: "learning",
                    color: "#FF9800",
                    frequency: "daily",
                    goal: "100 days streak",
                    icon: "fa-book",
                    completions: getRecentDates(7), // Sample: perfect streak!
                    skipped: [],
                    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() // Created 14 days ago
                }
            ];
            console.log('Sample habits initialized:', state.habits.length);
        }
    }
    
    // Helper function to generate recent dates for sample data
    function getRecentDates(count, skip = false) {
        const dates = [];
        const today = new Date();
        
        for (let i = 0; i < count; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            // Skip some dates to make it more realistic
            if (skip && i % 2 === 0) continue;
            
            dates.push(date.toDateString());
        }
        
        return dates;
    }
    
    // Initialize sample habits and start the app
    initializeSampleHabits();
    initApp();
});