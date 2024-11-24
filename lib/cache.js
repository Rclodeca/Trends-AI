import { Redis } from '@upstash/redis'

export default class Cache {
    constructor() {
        this.redis = new Redis({
            url: process.env.UPSTASH_URL,
            token: process.env.UPSTASH_TOKEN
        })
    }

    async get(key) {
        return await this.redis.get(key)
    }

    async set(key, val) {
        return await this.redis.set(key, val)
    }
}