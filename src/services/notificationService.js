import cron from 'node-cron';
import { Todo } from '../models/todo.model.js';
import { User } from '../models/user.model.js';
import { getEmailService } from '../utils/emailService.js';

class NotificationService {
    constructor() {
        this.isRunning = false;
        this.sentReminders = new Set(); // Track sent reminders to avoid duplicates
    }

    start() {
        if (this.isRunning) {
            console.log('Notification service is already running');
            return;
        }

        // Run every 15 minutes to check for due date reminders (more responsive)
        cron.schedule('*/15 * * * *', async () => {
            console.log('🔍 Checking for due date reminders...');
            await this.checkDueDateReminders();
        });

        // Run every day at 9 AM to check for overdue todos
        cron.schedule('0 9 * * *', async () => {
            console.log('Running overdue notification check...');
            await this.checkOverdueTodos();
        });

        // Clean up sent reminders cache daily at midnight
        cron.schedule('0 0 * * *', () => {
            console.log('Cleaning up sent reminders cache...');
            this.sentReminders.clear();
        });

        this.isRunning = true;
        console.log('Notification service started successfully');
    }

    stop() {
        // Note: node-cron doesn't have a destroy method
        // Individual tasks can be destroyed, but we'll just mark as stopped
        this.isRunning = false;
        console.log('Notification service stopped');
    }

    async checkDueDateReminders() {
        try {
            const now = new Date();
            
            // Find todos with individual reminders enabled that haven't been sent yet
            const todosWithReminders = await Todo.find({
                status: { $ne: 'completed' },
                dueDate: { $exists: true, $ne: null },
                'reminder.enabled': true,
                'reminder.emailSent': false,
                dueDate: { $gt: now } // Only future todos
            }).populate('user', 'username email emailNotifications');

            for (const todo of todosWithReminders) {
                // Skip if user has disabled email notifications
                if (!todo.user.emailNotifications?.enabled || !todo.user.emailNotifications?.dueDateReminder) {
                    continue;
                }

                const dueDate = new Date(todo.dueDate);
                const reminderTime = new Date(dueDate.getTime() - (todo.reminder.minutesBefore * 60 * 1000));
                
                // Check if it's time to send the reminder
                if (now >= reminderTime) {
                    try {
                        const emailService = getEmailService();
                        await emailService.sendDueDateReminder(
                            todo.user.email,
                            todo.user.username,
                            todo
                        );
                        
                        // Mark reminder as sent
                        todo.reminder.emailSent = true;
                        todo.reminder.emailSentAt = now;
                        await todo.save();
                        
                        console.log(`✅ Sent personalized reminder to ${todo.user.email} for todo: ${todo.title} (${todo.reminder.minutesBefore} min before)`);
                    } catch (error) {
                        console.error(`❌ Failed to send reminder to ${todo.user.email}:`, error);
                    }
                }
            }
        } catch (error) {
            console.error('Error in checkDueDateReminders:', error);
        }
    }

    async checkOverdueTodos() {
        try {
            const now = new Date();
            
            // Get all users with overdue notifications enabled
            const users = await User.find({
                'emailNotifications.enabled': true,
                'emailNotifications.overdueNotification': true
            });

            for (const user of users) {
                // Find todos that are overdue (past due date and not completed)
                const overdueTodos = await Todo.find({
                    user: user._id,
                    status: { $ne: 'completed' },
                    dueDate: { $lt: now }
                });

                for (const todo of overdueTodos) {
                    const overdueKey = `${user._id}-${todo._id}-overdue-${now.toDateString()}`;
                    
                    // Send overdue notification once per day
                    if (!this.sentReminders.has(overdueKey)) {
                        try {
                            const emailService = getEmailService();
                            await emailService.sendOverdueNotification(
                                user.email,
                                user.username,
                                todo
                            );
                            
                            this.sentReminders.add(overdueKey);
                            console.log(`Sent overdue notification to ${user.email} for todo: ${todo.title}`);
                        } catch (error) {
                            console.error(`Failed to send overdue notification to ${user.email}:`, error);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error in checkOverdueTodos:', error);
        }
    }

    // Manual trigger for testing
    async sendTestReminder(userId, todoId) {
        try {
            const user = await User.findById(userId);
            const todo = await Todo.findById(todoId);

            if (!user || !todo) {
                throw new Error('User or Todo not found');
            }

            const emailService = getEmailService();
            await emailService.sendDueDateReminder(user.email, user.username, todo);
            console.log(`Test reminder sent to ${user.email}`);
            return true;
        } catch (error) {
            console.error('Error sending test reminder:', error);
            throw error;
        }
    }

    // Get notification statistics
    async getNotificationStats() {
        try {
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            
            // Count todos due today
            const todosDueToday = await Todo.countDocuments({
                status: { $ne: 'completed' },
                dueDate: {
                    $gte: startOfDay,
                    $lt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
                }
            });

            // Count overdue todos
            const overdueTodos = await Todo.countDocuments({
                status: { $ne: 'completed' },
                dueDate: { $lt: now }
            });

            // Count users with notifications enabled
            const usersWithNotifications = await User.countDocuments({
                'emailNotifications.enabled': true
            });

            return {
                todosDueToday,
                overdueTodos,
                usersWithNotifications,
                sentRemindersToday: this.sentReminders.size
            };
        } catch (error) {
            console.error('Error getting notification stats:', error);
            return null;
        }
    }
}

export const notificationService = new NotificationService();
