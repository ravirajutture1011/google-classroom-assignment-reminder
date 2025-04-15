import Redis from "ioredis"

const redis = new Redis("rediss://default:AUmUAAIjcDFjZDYyM2M5ZTU3OTc0N2I4YTE3MjkwNGI4MGYyY2Y2MHAxMA@glad-garfish-18836.upstash.io:6379");
// await redis.set('hello', 'babeeee');

export default redis;