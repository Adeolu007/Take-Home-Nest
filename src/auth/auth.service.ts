import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schemas/refresh-token.schema';
import {v4 as uuidv4} from 'uuid';
import { UpdateUserDto } from './dtos/update-user.dto';
@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name) private UserModel: Model<User>,
        @InjectModel(RefreshToken.name) 
        private RefeshTokenModel: Model<RefreshToken>,
    private jwtservice: JwtService,){}
async register(registerData: RegisterDto){
    const {email, password, name} = registerData
    //check if email already exists
    const emailInUse = await this.UserModel.findOne({
         email,
    });
    if (emailInUse){
        throw new BadRequestException('Email is already in use');
    }
    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10)

    //Create user document
    await this.UserModel.create({
        name, email, password: hashedPassword,
    })
}

async updateUser(userId: string, updateData: UpdateUserDto){
    const {name, email, password, } = updateData;
    const user = await this.UserModel.findById(userId);
    if(!user){
        throw new UnauthorizedException('wrong credentials')
    }
    const passwordMatch = await bcrypt.compare(password, user.password)
    if(!passwordMatch){
        throw new UnauthorizedException('wrong credentials')
    }
    await this.UserModel.findByIdAndUpdate(userId, updateData, { new: true });
    return this.UserModel.findById(userId);
}

async login(credentials:LoginDto){
    const {email, password} = credentials;
    // find if user exists
    const user = await this.UserModel.findOne({email})
    if(!user){
        throw new UnauthorizedException('wrong credentials')
    }
    //compare entered password with existing password
    const passwordMatch = await bcrypt.compare(password, user.password)
    if(!passwordMatch){
        throw new UnauthorizedException('wrong credentials')
    }
    //Generate JWT tokens
    return this.generateUserTokens(user._id)

}

    async refreshTokens(refreshToken: string){
        const token = await this.RefeshTokenModel.findOneAndDelete({
            token: refreshToken,
            expiryDate: {$gte: new Date()}
        });

        if(!token){
            throw new UnauthorizedException("Refresh Token is invalid");
        }
        return this.generateUserTokens(token.userId)
    }

async generateUserTokens(userId){
    const accessToken = this.jwtservice.sign({userId},{expiresIn:'1h'});
    const refreshToken = uuidv4();
    
    await this.storeRefreshToken(refreshToken, userId)
    return{accessToken,
        refreshToken,
    };
}

async storeRefreshToken(token: string, userId){
    //calculate expiry date 2 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate()+2)
    await this.RefeshTokenModel.create({token, userId, expiryDate})
}
}
