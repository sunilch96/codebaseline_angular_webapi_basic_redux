import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SharedState } from "./shared.state";

export const SharedStateName = "shared";

const _getShareStater = createFeatureSelector<SharedState>(SharedStateName);

//selectors: get from state
//Get Loading
export const getLoadingStateSelector = createSelector(_getShareStater, 
    (state)=> state.showLoading);

export const getErrorStateSelector = createSelector(_getShareStater, (state)=> state.errorMessage);