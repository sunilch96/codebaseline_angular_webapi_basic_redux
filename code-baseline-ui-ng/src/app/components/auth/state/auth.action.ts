import { createAction, props } from "@ngrx/store";
import { UserModel } from "src/app/models/user.model";

//Login
const LOGIN_START = 'LOGIN_START';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';
const LOGOUT_USER = 'LOGOUT_USER';
export const LoginStartAction = createAction( LOGIN_START, 
    props<{email:string, password:string}>() );
export const LoginSuccessAction = createAction( LOGIN_SUCCESS, 
    props<{user:UserModel, redirect:boolean}>() );
export const LogOutUserAction = createAction(LOGOUT_USER)

//Sign Up
const SIGNUP_START_ACTION = "SIGNUP_START_ACTION";
const SIGNUP_SUCCESS_ACTION = "SIGNUP_SUCCESS_ACTION";
const AUTO_LOGIN_ACTION = "AUTO_LOGIN_ACTION";
export const SignUpStartAction = createAction( SIGNUP_START_ACTION, 
    props<{userName:string, email:string, password:string}>() )
export const SignUpSuccessAction = createAction( SIGNUP_SUCCESS_ACTION, 
    props<{user:UserModel}>() );
export const AutoLoginAction = createAction(AUTO_LOGIN_ACTION)

export const AuthDummyAction = createAction("Auth Dummy Action");