let crawlerStatus = {
  isActive: false,
  currentUrl: null,
  startTime: null,
  lastCompleted: null,
  completedCount: 0,
  failedCount: 0
};

// Update when crawler starts crawling
export const startCrawling = (url) => {
  crawlerStatus = {
    ...crawlerStatus,
    isActive: true,
    currentUrl: url,
    startTime: new Date()
  };
  return crawlerStatus;
};

// Update when crawler completes
export const completeCrawling = (success = true) => {
  const now = new Date();
  crawlerStatus = {
    ...crawlerStatus,
    isActive: false,
    lastCompleted: now,
    completedCount: success ? crawlerStatus.completedCount + 1 : crawlerStatus.completedCount,
    failedCount: !success ? crawlerStatus.failedCount + 1 : crawlerStatus.failedCount,
    currentUrl: null,
    startTime: null
  };
  return crawlerStatus;
};

// Get current status
export const getCrawlerStatus = () => {
  return {
    ...crawlerStatus,
    uptime: process.uptime(),
    memory: process.memoryUsage()
  };
};