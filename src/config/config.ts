export default () => ({
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    database: {
        connectionString: process.env.MONGO_URL,
    },
    
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
  },

})