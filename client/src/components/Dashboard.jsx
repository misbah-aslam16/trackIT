import React, { useState, useEffect } from 'react';

const Dashboard = ({ user, tasks }) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('light');

  // Apply theme when it changes
  useEffect(() => {
    // Remove any existing theme classes
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-blue', 'theme-purple');
    // Add the current theme class
    document.body.classList.add(`theme-${currentTheme}`);

    // Save theme preference to localStorage
    localStorage.setItem('appTheme', currentTheme);
  }, [currentTheme]);

  // Load saved theme on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('appTheme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
  }, []);
  const totalTasks = tasks?.length || 0;
  const todoTasks = tasks?.filter(task => task.status === 'To Do').length || 0;
  const inProgressTasks = tasks?.filter(task => task.status === 'In Progress').length || 0;
  const doneTasks = tasks?.filter(task => task.status === 'Done').length || 0;
  const userTasks = tasks?.filter(task => task.assignedTo === user?.name).length || 0;

  // Calculate completion percentage
  const completionPercentage = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Calculate task distribution percentages for the chart
  const todoPercentage = totalTasks > 0 ? Math.round((todoTasks / totalTasks) * 100) : 0;
  const inProgressPercentage = totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0;
  const donePercentage = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Get current date and time
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Time of day greeting
  const getGreeting = () => {
    const hour = currentDate.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const StatCard = ({ title, count, color, icon, subtitle }) => (
    <div className="stat-card" style={{ backgroundColor: color }}>
      <div className="stat-card-content">
        <div className="icon">
          <i className={icon}></i>
        </div>
        <div className="stat-text">
          <h3>{title}</h3>
          {subtitle && <div className="stat-subtitle">{subtitle}</div>}
        </div>
      </div>
      <p>{count}</p>
      {title === "Total Tasks" && totalTasks > 0 && (
        <div className="stat-mini-chart">
          <div className="mini-bar todo" style={{ width: `${todoPercentage}%` }} title={`To Do: ${todoPercentage}%`}></div>
          <div className="mini-bar progress" style={{ width: `${inProgressPercentage}%` }} title={`In Progress: ${inProgressPercentage}%`}></div>
          <div className="mini-bar done" style={{ width: `${donePercentage}%` }} title={`Done: ${donePercentage}%`}></div>
        </div>
      )}
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-greeting">
          <h2 className="dashboard-title">
            <span className="greeting">{getGreeting()},</span> {user?.name}!
          </h2>
          <p className="dashboard-date">
            <i className="far fa-calendar-alt"></i> {formattedDate}
          </p>
        </div>

        <div className="dashboard-actions">
          <button
            className="dashboard-action-btn"
            onClick={() => setShowReportModal(true)}
          >
            <i className="fas fa-chart-line"></i> View Reports
          </button>
          <button
            className="dashboard-action-btn"
            onClick={() => setShowSettingsModal(true)}
          >
            <i className="fas fa-cog"></i> Settings
          </button>
        </div>
      </div>

      <div className="dashboard-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-chart-pie"></i>
          </div>
          <div className="summary-content">
            <h3>Task Summary</h3>
            <p>You have {todoTasks} tasks to do and {inProgressTasks} in progress.</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-trophy"></i>
          </div>
          <div className="summary-content">
            <h3>Achievements</h3>
            <p>You've completed {doneTasks} tasks so far. Keep it up!</p>
          </div>
        </div>
      </div>

      <div className="stat-cards">
        <StatCard
          title="Total Tasks"
          count={totalTasks}
          color="#3498db"
          icon="fas fa-tasks"
          subtitle="All tasks"
        />
        <StatCard
          title="To Do"
          count={todoTasks}
          color="#e74c3c"
          icon="fas fa-list-check"
          subtitle="Pending tasks"
        />
        <StatCard
          title="In Progress"
          count={inProgressTasks}
          color="#f39c12"
          icon="fas fa-spinner fa-spin"
          subtitle="Active tasks"
        />
        <StatCard
          title="Completed"
          count={doneTasks}
          color="#2ecc71"
          icon="fas fa-check-circle"
          subtitle="Finished tasks"
        />
        <StatCard
          title="My Tasks"
          count={userTasks}
          color="#9b59b6"
          icon="fas fa-user-check"
          subtitle="Assigned to you"
        />
      </div>

      {totalTasks > 0 && (
        <div className="progress-section">
          <div className="progress-header">
            <h3>
              <i className="fas fa-chart-line"></i> Project Completion
            </h3>
            <span className="progress-percentage">{completionPercentage}%</span>
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar" style={{
              width: `${completionPercentage}%`,
              backgroundColor: completionPercentage >= 75 ? '#2ecc71' : completionPercentage >= 50 ? '#f39c12' : '#e74c3c',
            }}></div>
          </div>

          <div className="progress-stats">
            <div className="progress-stat">
              <span className="stat-label">To Do</span>
              <span className="stat-value">{todoTasks}</span>
              <span className="stat-percentage">{todoPercentage}%</span>
            </div>
            <div className="progress-stat">
              <span className="stat-label">In Progress</span>
              <span className="stat-value">{inProgressTasks}</span>
              <span className="stat-percentage">{inProgressPercentage}%</span>
            </div>
            <div className="progress-stat">
              <span className="stat-label">Completed</span>
              <span className="stat-value">{doneTasks}</span>
              <span className="stat-percentage">{donePercentage}%</span>
            </div>
          </div>
        </div>
      )}

      {totalTasks === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-clipboard"></i>
          </div>
          <h3>No Tasks Yet</h3>
          <p>Create your first task to get started with your project management.</p>
          <button
            className="empty-action-btn"
            onClick={() => {
              // Scroll to the task form section
              const taskForm = document.querySelector('.task-form');
              if (taskForm) {
                taskForm.scrollIntoView({ behavior: 'smooth' });
                // Add a highlight effect
                taskForm.classList.add('highlight-form');
                setTimeout(() => {
                  taskForm.classList.remove('highlight-form');
                }, 2000);
              }
            }}
          >
            <i className="fas fa-plus"></i> Add Your First Task
          </button>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-chart-line"></i> Task Reports</h2>
              <button className="modal-close" onClick={() => setShowReportModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="report-section">
                <h3>Task Distribution</h3>
                <div className="report-chart">
                  <div className="chart-bar">
                    <div className="chart-label">To Do</div>
                    <div className="chart-value-container">
                      <div
                        className="chart-value todo"
                        style={{ width: `${todoPercentage}%` }}
                      ></div>
                    </div>
                    <div className="chart-percentage">{todoPercentage}%</div>
                  </div>
                  <div className="chart-bar">
                    <div className="chart-label">In Progress</div>
                    <div className="chart-value-container">
                      <div
                        className="chart-value progress"
                        style={{ width: `${inProgressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="chart-percentage">{inProgressPercentage}%</div>
                  </div>
                  <div className="chart-bar">
                    <div className="chart-label">Completed</div>
                    <div className="chart-value-container">
                      <div
                        className="chart-value done"
                        style={{ width: `${donePercentage}%` }}
                      ></div>
                    </div>
                    <div className="chart-percentage">{donePercentage}%</div>
                  </div>
                </div>
              </div>

              <div className="report-section">
                <h3>Task Completion Rate</h3>
                <div className="completion-rate">
                  <div className="completion-circle" style={{
                    background: `conic-gradient(
                      ${completionPercentage >= 75 ? '#2ecc71' : completionPercentage >= 50 ? '#f39c12' : '#e74c3c'}
                      ${completionPercentage * 3.6}deg,
                      #f1f1f1 0deg
                    )`
                  }}>
                    <div className="completion-inner">
                      <span className="completion-percentage">{completionPercentage}%</span>
                      <span className="completion-label">Complete</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="report-section">
                <h3>Task Summary</h3>
                <div className="report-summary">
                  <div className="summary-item">
                    <div className="summary-icon todo-icon">
                      <i className="fas fa-list-check"></i>
                    </div>
                    <div className="summary-details">
                      <span className="summary-value">{todoTasks}</span>
                      <span className="summary-label">To Do</span>
                    </div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-icon progress-icon">
                      <i className="fas fa-spinner"></i>
                    </div>
                    <div className="summary-details">
                      <span className="summary-value">{inProgressTasks}</span>
                      <span className="summary-label">In Progress</span>
                    </div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-icon done-icon">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="summary-details">
                      <span className="summary-value">{doneTasks}</span>
                      <span className="summary-label">Completed</span>
                    </div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-icon total-icon">
                      <i className="fas fa-tasks"></i>
                    </div>
                    <div className="summary-details">
                      <span className="summary-value">{totalTasks}</span>
                      <span className="summary-label">Total</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setShowReportModal(false)}>
                <i className="fas fa-check"></i> Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-cog"></i> Dashboard Settings</h2>
              <button className="modal-close" onClick={() => setShowSettingsModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="settings-section">
                <h3>Display Options</h3>
                <div className="settings-option">
                  <label className="settings-label">
                    <input type="checkbox" defaultChecked={true} />
                    <span className="settings-text">Show task summary cards</span>
                  </label>
                </div>
                <div className="settings-option">
                  <label className="settings-label">
                    <input type="checkbox" defaultChecked={true} />
                    <span className="settings-text">Show progress section</span>
                  </label>
                </div>
                <div className="settings-option">
                  <label className="settings-label">
                    <input type="checkbox" defaultChecked={true} />
                    <span className="settings-text">Show statistics cards</span>
                  </label>
                </div>
              </div>

              <div className="settings-section">
                <h3>Theme Options</h3>
                <div className="theme-options">
                  <div
                    className={`theme-option ${currentTheme === 'light' ? 'active' : ''}`}
                    onClick={() => setCurrentTheme('light')}
                  >
                    <div className="theme-preview light"></div>
                    <span>Light</span>
                  </div>
                  <div
                    className={`theme-option ${currentTheme === 'dark' ? 'active' : ''}`}
                    onClick={() => setCurrentTheme('dark')}
                  >
                    <div className="theme-preview dark"></div>
                    <span>Dark</span>
                  </div>
                  <div
                    className={`theme-option ${currentTheme === 'blue' ? 'active' : ''}`}
                    onClick={() => setCurrentTheme('blue')}
                  >
                    <div className="theme-preview blue"></div>
                    <span>Blue</span>
                  </div>
                  <div
                    className={`theme-option ${currentTheme === 'purple' ? 'active' : ''}`}
                    onClick={() => setCurrentTheme('purple')}
                  >
                    <div className="theme-preview purple"></div>
                    <span>Purple</span>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>Notification Settings</h3>
                <div className="settings-option">
                  <label className="settings-label">
                    <input type="checkbox" defaultChecked={true} />
                    <span className="settings-text">Email notifications</span>
                  </label>
                </div>
                <div className="settings-option">
                  <label className="settings-label">
                    <input type="checkbox" defaultChecked={false} />
                    <span className="settings-text">Push notifications</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-danger"
                onClick={() => {
                  // Revert to saved theme
                  const savedTheme = localStorage.getItem('appTheme') || 'light';
                  setCurrentTheme(savedTheme);
                  setShowSettingsModal(false);
                }}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  // Theme is already saved in localStorage via useEffect
                  // Just close the modal
                  setShowSettingsModal(false);

                  // Show a success message
                  const successMessage = document.createElement('div');
                  successMessage.className = 'settings-saved-message';
                  successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Settings saved successfully';
                  document.body.appendChild(successMessage);

                  // Remove the message after 3 seconds
                  setTimeout(() => {
                    successMessage.classList.add('fade-out');
                    setTimeout(() => {
                      document.body.removeChild(successMessage);
                    }, 500);
                  }, 3000);
                }}
              >
                <i className="fas fa-save"></i> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
