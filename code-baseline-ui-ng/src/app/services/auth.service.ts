import { Injectable } from "@angular/core";
import {HttpClient} from '@angular/common/http';
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "../store/app.state";
import { LogOutUserAction } from "../components/auth/state/auth.action";
import { AuthResponseDataModel } from "../models/authResponseData.model";
import { UserModel } from "../models/user.model";
import { AppConstants } from "../data/appConstants";

@Injectable({
    providedIn:'root'
})
export class AuthService{
    constructor(private httpClient: HttpClient,
        private store: Store<AppState>){}
        baseUrl:string = AppConstants.baseApiUrl;
    timeOutInterval:any;

    login(email:string, password:string):Observable<AuthResponseDataModel>{       
        return this.httpClient.post<AuthResponseDataModel>(this.baseUrl + 'api/Authenticate/login',
        {
            username: email,
            password
        });
    }

    signUp(username:string, email:string, password:string):Observable<any>{
        return this.httpClient.post<any>(this.baseUrl + 'api/Authenticate/register',
        {
            username,
            email,
            password
        });
    }

    logOutUser(){
        localStorage.removeItem('userData');
        if(this.timeOutInterval){
            clearTimeout(this.timeOutInterval);
            this.timeOutInterval = null;
        }
    }

    saveUserToLocalStorage(user: UserModel){
        if(!user){
            return;
        }
        localStorage.setItem('userData', JSON.stringify(user));        
        this.userLocalStorageTimeoutInterval(user);
    }

    //check token expiry
    userLocalStorageTimeoutInterval(userData:UserModel){
        if(!userData){
            return;
        }
        const currentDate = new Date().getTime();
        const expirationDate = new Date(userData.expiration).getTime();
        const timeInterval = expirationDate - currentDate;
        this.timeOutInterval = setTimeout(() => {   
            //Log Out functionality or get refresh token. 
            this.store.dispatch(LogOutUserAction());
        }, timeInterval);
    }
    getUserFromLocalStorage(){
        const userDataLocal = localStorage.getItem('userData');
        if(!userDataLocal){
            return null;
        }
        const userData:UserModel = JSON.parse(userDataLocal);
        this.userLocalStorageTimeoutInterval(userData);
        return userData;
    }

    formatUser(data: AuthResponseDataModel){
        const expDate = new Date(data.expiration);
        const user = new UserModel(data.email, data.accessToken, data.id, expDate)
        return user;
    }

    getErrorMessage(message:string):string{
        switch(message){
            case 'Unauthorized':
            return 'Username or Password is Incorrect';
            case 'User already exists!':
            return message

            default: return 'Unknown Error Occured, please try again.'
        }
    }
    
}