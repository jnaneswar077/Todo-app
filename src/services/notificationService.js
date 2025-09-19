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

        // Run every hour to check for due date reminders
        cron.schedule('0 * * * *', async () => {
            console.log('Running due date reminder check...');
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
            
            // Get all users with email notifications enabled
            const users = await User.find({
                'emailNotifications.enabled': true,
                'emailNotifications.dueDateReminder': true
            });

            for (const user of users) {
                const reminderHours = user.emailNotifications.reminderHours || 24;
                const reminderTime = new Date(now.getTime() + (reminderHours * 60 * 60 * 1000));

                // Find todos that are due within the reminder window
                const todosDueSoon = await Todo.find({
                    user: user._id,
                    status: { $ne: 'completed' },
                    dueDate: {
                        $gte: now,
                        $lte: reminderTime
                    }
                });

                for (const todo of todosDueSoon) {
                    const reminderKey = `${user._id}-${todo._id}-reminder`;
                    
                    // Check if we've already sent a reminder for this todo
                    if (!this.sentReminders.has(reminderKey)) {
                        try {
                            const emailService = getEmailService();
                            await emailService.sendDueDateReminder(
                                user.email,
                                user.username,
                                todo
                            );
                            
                            this.sentReminders.add(reminderKey);
                            console.log(`Sent due date reminder to ${user.email} for todo: ${todo.title}`);
                        } catch (error) {
                            console.error(`Failed to send reminder to ${user.email}:`, error);
                        }
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
