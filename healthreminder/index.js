/* eslint-disable no-undef */
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { defineSecret } = require('firebase-functions/params');
const { logger } = require('firebase-functions');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
const sgMail = require('@sendgrid/mail');

// Initialize Firebase Admin SDK once per codebase
initializeApp();

const SENDGRID_API_KEY = defineSecret('SENDGRID_API_KEY');
const SENDGRID_FROM = defineSecret('SENDGRID_FROM');

// Health tips database
const HEALTH_TIPS = {
  general: [
    "💧 Stay hydrated – aim for 6-8 glasses of water daily",
    "🍎 Eat a rainbow of fruits and vegetables",
    "🏃 Get at least 30 minutes of physical activity",
    "😴 Aim for 7-9 hours of quality sleep",
    "🧘 Practice mindfulness or meditation for 10 minutes"
  ],
  female: [
    "🌸 Track your menstrual cycle for better health insights",
    "🥗 Focus on iron-rich foods during your period",
    "💪 Include strength training to support bone health",
    "🌿 Consider folic acid if planning pregnancy",
    "❤️ Regular cardiovascular exercise for heart health"
  ],
  senior: [
    "🦴 Include calcium and vitamin D for bone health",
    "🧠 Stay mentally active with puzzles or reading",
    "🚶 Gentle walking helps maintain mobility",
    "👥 Stay socially connected with friends and family",
    "🏥 Keep up with regular health checkups"
  ]
};

// Helper function to get personalized health tips
function getPersonalizedTips(userType = 'general') {
  const tips = HEALTH_TIPS[userType] || HEALTH_TIPS.general;
  return tips[Math.floor(Math.random() * tips.length)];
}

// Helper function to create email template
function createEmailTemplate(userType = 'general', userName = '') {
  const personalizedTip = getPersonalizedTips(userType);
  const greeting = userName ? `Hello ${userName}!` : 'Hello!';

  return `
    <div style="font-family: Arial, sans-serif; color:#333; line-height:1.6; max-width:600px; margin:0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px;">🌸 Sheswell Health Reminder</h1>
      </div>
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #667eea; margin-top: 0;">💖 ${greeting}</h2>
        <p style="font-size: 16px; margin-bottom: 20px;">Your personalized health reminder for today:</p>

        <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin: 20px 0;">
          <h3 style="color: #667eea; margin-top: 0;">🎯 Today's Focus</h3>
          <p style="font-size: 18px; font-weight: bold; color: #333;">${personalizedTip}</p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h3 style="color: #667eea; margin-top: 0;">📋 Daily Checklist</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 5px;">💧 <b>Hydration</b> – 6-8 glasses of water</li>
            <li style="margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 5px;">🍎 <b>Nutrition</b> – balanced meals with fruits & veggies</li>
            <li style="margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 5px;">🏃 <b>Movement</b> – 30 minutes of activity</li>
            <li style="margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 5px;">😴 <b>Rest</b> – 7-9 hours of quality sleep</li>
            <li style="margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 5px;">🧘 <b>Mindfulness</b> – 10 minutes of calm</li>
          </ul>
        </div>

        <p style="text-align: center; margin: 30px 0; font-style: italic; color: #666;">
          Remember: Small steps lead to big changes. You're doing great! 💐
        </p>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 14px;">— Sheswell Health Team</p>
          <p style="color: #999; font-size: 12px;">
            <a href="#" style="color: #667eea;">Unsubscribe</a> |
            <a href="#" style="color: #667eea;">Update Preferences</a>
          </p>
        </div>
      </div>
    </div>
  `;
}

// Enhanced daily health reminder with error handling and analytics
exports.dailyHealthReminderAuth = onSchedule(
  {
    schedule: '00 22 * * *',         
    timeZone: 'Australia/Sydney',     
    secrets: [SENDGRID_API_KEY, SENDGRID_FROM],
    memory: '1GiB',                   
    timeoutSeconds: 540,              
    maxInstances: 10,                
  },
  async () => {
    const startTime = Date.now();
    const analytics = {
      totalUsers: 0,
      emailsSent: 0,
      errors: [],
      executionTime: 0
    };

    try {
      logger.info('🚀 Starting daily health reminder function');

      // Initialize SendGrid
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      // Get Firestore instance for user preferences
      const db = getFirestore();
      const auth = getAuth();

      // 1) Get users with preferences from Firestore
      const usersRef = db.collection('userPreferences');
      const usersSnapshot = await usersRef.where('emailNotifications', '==', true).get();

      const userEmails = [];
      const userPreferences = new Map();

      usersSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.email && data.emailNotifications) {
          userEmails.push(data.email);
          userPreferences.set(data.email, {
            userType: data.userType || 'general',
            userName: data.userName || '',
            reminderTime: data.reminderTime || '08:00'
          });
        }
      });

      if (userEmails.length === 0) {
        logger.info('No user preferences found, falling back to Auth users');
        let nextPageToken = undefined;

        do {
          try {
            const result = await auth.listUsers(1000, nextPageToken);
            result.users.forEach(u => {
              if (u.email) {
                userEmails.push(u.email);
                userPreferences.set(u.email, {
                  userType: 'general',
                  userName: u.displayName || '',
                  reminderTime: '08:00'
                });
              }
            });
            nextPageToken = result.pageToken;
          } catch (authError) {
            logger.error('Error fetching Auth users:', authError);
            break;
          }
        } while (nextPageToken);
      }

      analytics.totalUsers = userEmails.length;

      if (userEmails.length === 0) {
        logger.info('No users found for health reminders');
        return;
      }

      logger.info(`📧 Preparing to send personalized reminders to ${userEmails.length} users`);

      const chunkSize = 100; // Reduced batch size for better reliability
      const batches = [];

      for (let i = 0; i < userEmails.length; i += chunkSize) {
        batches.push(userEmails.slice(i, i + chunkSize));
      }

      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        const messages = [];

        // Create personalized messages for each user in the batch
        for (const email of batch) {
          const prefs = userPreferences.get(email) || { userType: 'general', userName: '' };
          const userType = prefs.userType || 'general';
          const userName = prefs.userName || '';

          messages.push({
            to: email,
            from: process.env.SENDGRID_FROM,
            subject: `🌸 Your Daily Health Reminder - ${new Date().toLocaleDateString()}`,
            html: createEmailTemplate(userType, userName),
            trackingSettings: {
              clickTracking: { enable: true },
              openTracking: { enable: true }
            }
          });
        }

        // Send batch with retry logic
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
          try {
            await sgMail.send(messages);
            analytics.emailsSent += messages.length;
            logger.info(`✅ Batch ${batchIndex + 1}/${batches.length} sent successfully (${messages.length} emails)`);
            break;
          } catch (error) {
            retryCount++;
            logger.error(`❌ SendGrid error for batch ${batchIndex + 1}, attempt ${retryCount}:`, error);

            if (retryCount >= maxRetries) {
              analytics.errors.push({
                batch: batchIndex + 1,
                error: error.message,
                emails: messages.length
              });
            } else {
              // Exponential backoff
              await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
            }
          }
        }

        // Small delay between batches to avoid rate limiting
        if (batchIndex < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      analytics.executionTime = Date.now() - startTime;

      // Log analytics
      logger.info('📊 Health Reminder Analytics:', {
        totalUsers: analytics.totalUsers,
        emailsSent: analytics.emailsSent,
        errors: analytics.errors.length,
        executionTime: `${analytics.executionTime}ms`,
        successRate: `${((analytics.emailsSent / analytics.totalUsers) * 100).toFixed(2)}%`
      });

      // Store analytics in Firestore for monitoring
      await db.collection('analytics').doc('healthReminders').set({
        lastRun: new Date(),
        totalUsers: analytics.totalUsers,
        emailsSent: analytics.emailsSent,
        errors: analytics.errors.length,
        executionTime: analytics.executionTime,
        successRate: (analytics.emailsSent / analytics.totalUsers) * 100
      }, { merge: true });

    } catch (error) {
      logger.error('💥 Critical error in health reminder function:', error);
      analytics.errors.push({ critical: true, error: error.message });

      // Store error analytics
      const db = getFirestore();
      await db.collection('analytics').doc('healthReminders').set({
        lastRun: new Date(),
        criticalError: true,
        error: error.message,
        executionTime: Date.now() - startTime
      }, { merge: true });

      throw error; 
    }
  }
);

