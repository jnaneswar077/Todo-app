import nodemailer from 'nodemailer';
import { ApiError } from './ApiError.js';

class EmailService {
    constructor() {
        this.transporter = null;
        this.initializeTransporter();
    }

    initializeTransporter() {
        try {
            // Debug: Log email configuration (without showing full password)
            console.log('🔍 Email Debug Info:');
            console.log('  EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
            console.log('  EMAIL_USER:', process.env.EMAIL_USER);
            console.log('  EMAIL_PASSWORD length:', process.env.EMAIL_PASSWORD?.length);
            console.log('  EMAIL_PASSWORD first 4 chars:', process.env.EMAIL_PASSWORD?.substring(0, 4));
            
            this.transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            // Verify connection configuration (non-blocking)
            this.transporter.verify((error, success) => {
                if (error) {
                    console.log('⚠️ Email service configuration error:', error.message);
                    console.log('📧 Email notifications will be disabled until credentials are fixed');
                } else {
                    console.log('✅ Email service is ready to send messages');
                }
            });
        } catch (error) {
            console.error('Failed to initialize email transporter:', error);
        }
    }

    async sendEmail(to, subject, htmlContent, textContent = '') {
        try {
            if (!this.transporter) {
                console.log('⚠️ Email service not available - skipping email send');
                return { messageId: 'skipped-no-transporter' };
            }

            // Check if we have valid credentials
            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
                console.log('⚠️ Email credentials missing - skipping email send');
                return { messageId: 'skipped-no-credentials' };
            }

            const mailOptions = {
                from: `"${process.env.EMAIL_FROM_NAME || 'Todo App'}" <${process.env.EMAIL_USER}>`,
                to: to,
                subject: subject,
                text: textContent,
                html: htmlContent
            };

            const result = await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', result.messageId);
            return result;
        } catch (error) {
            console.error('Error sending email:', error);
            throw new ApiError(500, 'Failed to send email');
        }
    }

    async sendDueDateReminder(userEmail, userName, todo) {
        const subject = `📅 Reminder: "${todo.title}" is due soon!`;
        
        const htmlContent = this.generateDueDateReminderHTML(userName, todo);
        const textContent = this.generateDueDateReminderText(userName, todo);

        return await this.sendEmail(userEmail, subject, htmlContent, textContent);
    }

    async sendOverdueNotification(userEmail, userName, todo) {
        const subject = `⚠️ Overdue: "${todo.title}" was due!`;
        
        const htmlContent = this.generateOverdueNotificationHTML(userName, todo);
        const textContent = this.generateOverdueNotificationText(userName, todo);

        return await this.sendEmail(userEmail, subject, htmlContent, textContent);
    }

    generateDueDateReminderHTML(userName, todo) {
        const dueDate = new Date(todo.dueDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const priorityColor = {
            'high': '#ff6b6b',
            'medium': '#ffb74d',
            'low': '#81c784'
        }[todo.priority] || '#667eea';

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Todo Reminder</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
                .content { padding: 30px; }
                .todo-card { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid ${priorityColor}; }
                .priority-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; background: ${priorityColor}; color: white; }
                .due-date { font-size: 18px; font-weight: bold; color: #e74c3c; margin: 10px 0; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
                .btn { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📅 Todo Reminder</h1>
                    <p>Don't forget about your upcoming task!</p>
                </div>
                <div class="content">
                    <h2>Hi ${userName}!</h2>
                    <p>This is a friendly reminder that you have a todo item due soon:</p>
                    
                    <div class="todo-card">
                        <h3>${todo.title}</h3>
                        ${todo.description ? `<p>${todo.description}</p>` : ''}
                        <div class="priority-badge">${todo.priority} Priority</div>
                        <div class="due-date">Due: ${dueDate}</div>
                        ${todo.tags && todo.tags.length > 0 ? `<p><strong>Tags:</strong> ${todo.tags.join(', ')}</p>` : ''}
                    </div>
                    
                    <p>Don't let this task slip by! Log in to your Todo app to mark it as completed or update the due date if needed.</p>
                    
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:8000'}" class="btn">Open Todo App</a>
                </div>
                <div class="footer">
                    <p>This is an automated reminder from your Todo App.</p>
                    <p>You can manage your notification preferences in your account settings.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    generateDueDateReminderText(userName, todo) {
        const dueDate = new Date(todo.dueDate).toLocaleDateString();
        return `
Hi ${userName}!

This is a reminder that your todo item "${todo.title}" is due on ${dueDate}.

Priority: ${todo.priority}
${todo.description ? `Description: ${todo.description}` : ''}
${todo.tags && todo.tags.length > 0 ? `Tags: ${todo.tags.join(', ')}` : ''}

Don't forget to complete this task on time!

Visit your Todo App: ${process.env.FRONTEND_URL || 'http://localhost:8000'}

Best regards,
Todo App Team
        `;
    }

    generateOverdueNotificationHTML(userName, todo) {
        const dueDate = new Date(todo.dueDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Overdue Todo</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 30px; text-align: center; }
                .content { padding: 30px; }
                .todo-card { background: #fff5f5; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #e74c3c; }
                .overdue-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; background: #e74c3c; color: white; }
                .due-date { font-size: 18px; font-weight: bold; color: #e74c3c; margin: 10px 0; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
                .btn { display: inline-block; padding: 12px 24px; background: #e74c3c; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>⚠️ Overdue Task</h1>
                    <p>You have an overdue todo item!</p>
                </div>
                <div class="content">
                    <h2>Hi ${userName}!</h2>
                    <p>Your todo item is now overdue. Please take action as soon as possible:</p>
                    
                    <div class="todo-card">
                        <h3>${todo.title}</h3>
                        ${todo.description ? `<p>${todo.description}</p>` : ''}
                        <div class="overdue-badge">OVERDUE</div>
                        <div class="due-date">Was due: ${dueDate}</div>
                    </div>
                    
                    <p>Don't worry, it's not too late! Log in to your Todo app to complete this task or reschedule it.</p>
                    
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:8000'}" class="btn">Complete Task Now</a>
                </div>
                <div class="footer">
                    <p>This is an automated notification from your Todo App.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    generateOverdueNotificationText(userName, todo) {
        const dueDate = new Date(todo.dueDate).toLocaleDateString();
        return `
Hi ${userName}!

Your todo item "${todo.title}" is now OVERDUE. It was due on ${dueDate}.

${todo.description ? `Description: ${todo.description}` : ''}

Please complete this task as soon as possible or update the due date.

Visit your Todo App: ${process.env.FRONTEND_URL || 'http://localhost:8000'}

Best regards,
Todo App Team
        `;
    }
}

// Export the class, not an instance
export { EmailService };

// Create instance after dotenv is loaded
let emailServiceInstance = null;

export const getEmailService = () => {
    if (!emailServiceInstance) {
        emailServiceInstance = new EmailService();
    }
    return emailServiceInstance;
};
