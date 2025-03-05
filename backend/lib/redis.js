import Redis from "ioredis"

const redis = new Redis("rediss://default:AcBSAAIjcDFiZDA0ZGNjZjUxYjg0NzA1ODc3Mjc0ZmI0M2NjOTgzNnAxMA@destined-bonefish-49234.upstash.io:6379");
// await redis.set('hello', 'babeeee');

export default redis;