import { createClient } from 'redis';

export const redisConnection = async()=>{
    const client = createClient({
        username: 'default',
        password: process.env.REDIS_PASSWORD,
        socket: {
            host: 'redis-14896.c9.us-east-1-4.ec2.redns.redis-cloud.com',
            port: 14896
        }
    });
    await client.connect();
    return client
}

