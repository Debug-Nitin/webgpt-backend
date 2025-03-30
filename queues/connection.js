import amqp from 'amqplib';
import config from '../config/rabbitmq.js';

let connection = null;
let channel = null;

export const connect = async () => {
  try {
    if (connection) return { connection, channel };
    
    const { hostname, port, username, password } = config.connection;
    const connectionString = `amqp://${username}:${password}@${hostname}:${port}`;
    
    console.log('Connecting to RabbitMQ...');
    connection = await amqp.connect(connectionString);
    
    connection.on('error', (err) => {
      console.error('RabbitMQ connection error:', err.message);
      connection = null;
      setTimeout(connect, 5000);
    });
    
    connection.on('close', () => {
      console.log('RabbitMQ connection closed');
      connection = null;
      setTimeout(connect, 5000);
    });
    
    console.log('Creating RabbitMQ channel...');
    channel = await connection.createChannel();
    
    // Setup exchanges
    await channel.assertExchange(config.exchanges.crawl, 'direct', { durable: true });
    
    // Setup queues
    await channel.assertQueue(config.queues.crawl, { durable: true });
    
    // Bind queues to exchanges
    await channel.bindQueue(
      config.queues.crawl, 
      config.exchanges.crawl, 
      config.routingKeys.crawlWebsite
    );
    
    console.log('✅ RabbitMQ connected successfully');
    return { connection, channel };
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    throw error;
  }
};

export const disconnect = async () => {
  try {
    if (channel) {
      await channel.close();
      channel = null;
    }
    if (connection) {
      await connection.close();
      connection = null;
    }
    console.log('RabbitMQ disconnected');
  } catch (error) {
    console.error('Error disconnecting from RabbitMQ:', error);
  }
};

export const getChannel = async () => {
  if (!channel) {
    await connect();
  }
  return channel;
};

export default { connect, disconnect, getChannel };