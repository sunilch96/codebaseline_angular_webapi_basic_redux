import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth.state";

export const AuthStateName = 'auth';

const _getAuthStateSelector = createFeatureSelector<AuthState>(AuthStateName);

export const getIsAuthenticatedStateSelector = createSelector(_getAuthStateSelector, 
    (state)=> state?.user ? true:false);

export const getAuthTokenSelector = createSelector(_getAuthStateSelector, 
    (state)=>  {
        return state.user? state.user.accessToken : null
    })