import { Router } from 'express';
import { getEmailService, reinitializeEmailService } from '../utils/emailService.js';
import { notificationService } from '../services/notificationService.js';
import { Todo } from '../models/todo.model.js';
import { User } from '../models/user.model.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Test basic email sending
router.post('/test-email', verifyJWT, async (req, res) => {
    try {
        const { email, subject, message } = req.body;
        const emailService = getEmailService();
        
        const testEmail = email || req.user.email;
        const testSubject = subject || '🧪 Test Email from Todo App';
        const testMessage = message || 'This is a test email to verify your email service is working correctly!';
        
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #667eea;">✅ Email Service Test</h2>
                <p>Hello ${req.user.username}!</p>
                <p>${testMessage}</p>
                <p style="color: #666; font-size: 14px;">
                    Sent at: ${new Date().toLocaleString()}<br>
                    From: Todo App Email Service
                </p>
            </div>
        `;
        
        const result = await emailService.sendEmail(testEmail, testSubject, htmlContent, testMessage);
        
        res.status(200).json({
            success: true,
            message: 'Test email sent successfully!',
            messageId: result.messageId,
            sentTo: testEmail
        });
    } catch (error) {
        console.error('Test email failed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send test email',
            error: error.message
        });
    }
});

// Test due date reminder email
router.post('/test-reminder', verifyJWT, async (req, res) => {
    try {
        const { todoId } = req.body || {};
        
        let todo;
        if (todoId) {
            todo = await Todo.findById(todoId).populate('user');
            if (!todo) {
                return res.status(404).json({ success: false, message: 'Todo not found' });
            }
        } else {
            // Create a dummy todo for testing
            todo = {
                title: 'Sample Test Todo',
                description: 'This is a test todo for email reminder testing',
                priority: 'high',
                dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
                tags: ['test', 'email'],
                user: req.user
            };
        }
        
        const emailService = getEmailService();
        const result = await emailService.sendDueDateReminder(
            req.user.email,
            req.user.username,
            todo
        );
        
        res.status(200).json({
            success: true,
            message: 'Test reminder email sent successfully!',
            messageId: result.messageId,
            todoTitle: todo.title
        });
    } catch (error) {
        console.error('Test reminder failed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send test reminder',
            error: error.message
        });
    }
});

// Test overdue notification email
router.post('/test-overdue', verifyJWT, async (req, res) => {
    try {
        const { todoId } = req.body || {};
        
        let todo;
        if (todoId) {
            todo = await Todo.findById(todoId).populate('user');
            if (!todo) {
                return res.status(404).json({ success: false, message: 'Todo not found' });
            }
        } else {
            // Create a dummy overdue todo for testing
            todo = {
                title: 'Overdue Test Todo',
                description: 'This is a test overdue todo for email notification testing',
                priority: 'high',
                dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
                tags: ['test', 'overdue'],
                user: req.user
            };
        }
        
        const emailService = getEmailService();
        const result = await emailService.sendOverdueNotification(
            req.user.email,
            req.user.username,
            todo
        );
        
        res.status(200).json({
            success: true,
            message: 'Test overdue notification sent successfully!',
            messageId: result.messageId,
            todoTitle: todo.title
        });
    } catch (error) {
        console.error('Test overdue notification failed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send test overdue notification',
            error: error.message
        });
    }
});

// Check email service status
router.get('/email-status', async (req, res) => {
    try {
        const emailService = getEmailService();
        
        // Check if transporter exists and credentials are configured
        const hasTransporter = !!emailService.transporter;
        const hasCredentials = !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);
        
        // Get notification stats
        const stats = await notificationService.getNotificationStats();
        
        res.status(200).json({
            success: true,
            emailService: {
                configured: hasTransporter && hasCredentials,
                hasTransporter,
                hasCredentials,
                emailUser: process.env.EMAIL_USER || 'Not configured',
                service: 'Gmail SMTP'
            },
            notificationStats: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get email status',
            error: error.message
        });
    }
});

// Reinitialize email service (for debugging)
router.post('/reinit-email', async (req, res) => {
    try {
        const emailService = reinitializeEmailService();
        
        res.status(200).json({
            success: true,
            message: 'Email service reinitialized successfully!',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to reinitialize email service',
            error: error.message
        });
    }
});

export default router;
