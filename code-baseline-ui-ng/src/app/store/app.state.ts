import { routerReducer, RouterReducerState } from "@ngrx/router-store";
import { AuthReducer } from "../components/auth/state/auth.reducer";
import { AuthStateName } from "../components/auth/state/auth.selector";
import { AuthState } from "../components/auth/state/auth.state";
import { SharedReducer } from "../components/shared/state/shared.reducer";
import { SharedStateName } from "../components/shared/state/shared.selector";
import { SharedState } from "../components/shared/state/shared.state";

export interface AppState{
    [SharedStateName]: SharedState;
    [AuthStateName]: AuthState,
    router: RouterReducerState
}

export const AppStateReducer = {
    [SharedStateName]: SharedReducer,
    [AuthStateName]: AuthReducer,
    router : routerReducer
}