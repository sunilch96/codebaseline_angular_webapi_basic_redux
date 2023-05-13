import { createFeatureSelector,createSelector } from "@ngrx/store";
import { AdminState } from "./admin.state";

export const AdminStateName = 'admin';

const _getAdminStateName = createFeatureSelector<AdminState>(AdminStateName)

//Selectors : Get state data
export const getCategoriesStateSelector = createSelector(_getAdminStateName, state=>{
    return state.categories
});
//Get Admin List
export const getAdminStateSelector = createSelector(_getAdminStateName, state=>{
    return state.admin
})