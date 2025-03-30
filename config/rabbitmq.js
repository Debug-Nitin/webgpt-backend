import 'dotenv/config';

export default {
  connection: {
    hostname: process.env.RABBITMQ_HOST || 'localhost',
    port: process.env.RABBITMQ_PORT || 5672,
    username: process.env.RABBITMQ_USER || 'guest',
    password: process.env.RABBITMQ_PASS || 'guest',
  },
  exchanges: {
    crawl: 'crawl-exchange',
  },
  queues: {
    crawl: 'crawl-tasks',
  },
  routingKeys: {
    crawlWebsite: 'crawl.website',
  }
};