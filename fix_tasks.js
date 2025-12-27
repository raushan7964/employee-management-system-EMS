// Fix existing tasks in localStorage - Copy and paste this in browser console

// Get all tasks from localStorage
const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

console.log('Before fix - Total tasks:', tasks.length);

// Fix tasks that have status 'pending-approval' but no approvalStatus field
const fixedTasks = tasks.map(task => {
  if (task.status === 'pending-approval' && !task.approvalStatus) {
    console.log('Fixing task:', task.title);
    return {
      ...task,
      approvalStatus: 'pending'
    };
  }
  return task;
});

// Save back to localStorage
localStorage.setItem('tasks', JSON.stringify(fixedTasks));

console.log('After fix - Tasks with approvalStatus:', fixedTasks.filter(t => t.approvalStatus).length);
console.log('After fix - Pending tasks:', fixedTasks.filter(t => t.approvalStatus === 'pending' || t.status === 'pending-approval').length);

// Reload the page
console.log('Tasks fixed! Reloading page...');
setTimeout(() => window.location.reload(), 1000);
