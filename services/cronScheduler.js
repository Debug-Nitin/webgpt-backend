import { runMaintenance } from '../utils/maintenance.js';

// Simple in-process cron scheduler
export class CronScheduler {
  constructor() {
    this.jobs = new Map();
    this.running = false;
  }

  /**
   * Schedule a job to run at specified intervals
   * @param {string} jobName - Unique name for the job
   * @param {Function} jobFunction - Function to execute
   * @param {number} intervalMs - Interval in milliseconds
   */
  scheduleJob(jobName, jobFunction, intervalMs) {
    if (this.jobs.has(jobName)) {
      this.cancelJob(jobName);
    }

    const timer = setInterval(async () => {
      try {
        console.log(`Running scheduled job: ${jobName}`);
        await jobFunction();
      } catch (error) {
        console.error(`Error in scheduled job ${jobName}:`, error);
      }
    }, intervalMs);

    this.jobs.set(jobName, timer);
    console.log(`Job ${jobName} scheduled to run every ${intervalMs / 1000} seconds`);
  }

  /**
   * Cancel a scheduled job
   * @param {string} jobName - Name of the job to cancel
   */
  cancelJob(jobName) {
    const timer = this.jobs.get(jobName);
    if (timer) {
      clearInterval(timer);
      this.jobs.delete(jobName);
      console.log(`Job ${jobName} cancelled`);
    }
  }

  /**
   * Start all maintenance jobs
   */
  startMaintenanceJobs() {
    if (this.running) return;

    // Schedule database and queue maintenance to run daily at midnight
    // (86400000 ms = 24 hours)
    this.scheduleJob('system-maintenance', async () => {
      await runMaintenance();
    }, 86400000);

    this.running = true;
    console.log('Maintenance jobs started');
  }

  /**
   * Stop all scheduled jobs
   */
  stopAllJobs() {
    for (const [jobName, timer] of this.jobs.entries()) {
      clearInterval(timer);
      console.log(`Job ${jobName} stopped`);
    }
    
    this.jobs.clear();
    this.running = false;
    console.log('All scheduled jobs stopped');
  }
}

// Singleton instance
const scheduler = new CronScheduler();
export default scheduler;