import { createReducer, on } from "@ngrx/store";
import { LoginStartAction, LoginSuccessAction, LogOutUserAction, SignUpSuccessAction } from "./auth.action";
import { initialState } from "./auth.state"

const _authReducer = createReducer(initialState,
    on(LoginSuccessAction, (state, action)=>{
        return {
            ...state,
            user: action.user
        }
    }),
    on(LogOutUserAction, (state)=>{
        return { ...state, user:null }
    })
    );

export function AuthReducer(state, action){
    return _authReducer(state, action)
}