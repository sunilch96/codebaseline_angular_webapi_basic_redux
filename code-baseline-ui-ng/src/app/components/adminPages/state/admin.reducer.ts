import { createReducer, on } from "@ngrx/store"
import { LoadCategorySuccessAction } from "./admin.actions";
import { adminInitialState } from "./admin.state"

const _adminReducer = createReducer(adminInitialState,
    on(LoadCategorySuccessAction, (state, action)=>{
        return {
            ...state,
            categories: action.categories
        }
    })    
    );

export function adminReducer(state, action){
    return _adminReducer(state, action)
}