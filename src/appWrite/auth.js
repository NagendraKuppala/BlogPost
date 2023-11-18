import config from "../config/config"
import { Client, Account, ID } from "appwrite"

export class AuthService{
    client = new Client();
    account;

    constructor(){
        this.client
            .setEndpoint(config.appWriteUrl)
            .setProject(config.appWriteProjectID)
        
        this.account = new Account(this.client)
    }

    async createAccount({email, password, name}){
        try {
           const userAccount = await this.account.create(ID.unique(), email, password, name)

           if (userAccount) {
            //Call Login Method if User exist
            this.login(email, password)
           } else {
            return userAccount
           }
        } catch (error) {
            console.log("Error Creating Account", error);
            throw error
        }
    }

    async login({email, password}){
        try {
            await this.account.createEmailSession(email, password)
        } catch (error) {
            console.log('Error in Logging In', error);
            throw error
        }
    }

    async getCurrentUser(){
        try {
            const user = await this.account.get()
            if(user){
                return user 
            }
            // else {
            //     return null
            // }
        } catch (error) {
            console.log('Get Current User Error:', error)
        }
    }

    async logout(){
        try {
            await this.account.deleteSessions()
        } catch (error) {
            console.log('Log Out Error: ', error)
            throw error
        }
    }

}

const authService = new AuthService()

export default authService