import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';
import { BullModule } from '@nestjs/bull';
import { UsersModule } from './UsersController/user-module'; 


// @Module({
//   imports: [
//     JwtModule.register({global: true, secret: '123'}),

//     MongooseModule.forRoot('mongodb+srv://odunuyiadeolu:Treasurer15@nestjstest.4xvpc.mongodb.net/?retryWrites=true&w=majority&appName=nestjsTest'),
//     //MongooseModule.forRootAsync('mongodb+srv://odunuyiadeolu:Treasurer15@nestjstest.4xvpc.mongodb.net/?retryWrites=true&w=majority&appName=nestjsTest'),
 
//     AuthModule],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}


// console.log('Redis Host:', process.env.REDIS_HOST);
// console.log('Redis Port:', process.env.REDIS_PORT);
// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//       cache: true,
//       load: [config],
//     }),


//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       useFactory: async (config)=>({
//         secret: config.get('jwt.secret')
//       }),
//       global: true, 
//       inject: [ConfigService],
//     }),

//     MongooseModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: async (config)=>({
//         uri: config.get('database.connectionString'),
//       }),
//       inject: [ConfigService],
//     }),
//     //MongooseModule.forRootAsync('mongodb+srv://odunuyiadeolu:Treasurer15@nestjstest.4xvpc.mongodb.net/?retryWrites=true&w=majority&appName=nestjsTest'),
//     BullModule.forRoot({
//       redis: {
//         host: process.env.REDIS_HOST,
//         port: +process.env.REDIS_PORT,
//       },
      
//     }),
//     BullModule.registerQueue({
//       name: 'user-delete', // Register the queue
//     }),
//     AuthModule, UsersModule ,
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })


// export class AppModule {}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
      global: true,
      inject: [ConfigService],
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),

    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        // port: +process.env.REDIS_PORT, // Ensure conversion from string to number
        port: parseInt(process.env.REDIS_PORT, 10),
      },
    }),
    
    BullModule.registerQueue({
      name: 'user-delete',
    }),

    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
