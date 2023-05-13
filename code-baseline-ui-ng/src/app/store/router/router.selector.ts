import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RouterMainStateModel } from "./custom-router-store-serializer";

export const RouterStateName = 'router';
const _getRouterState = createFeatureSelector<RouterMainStateModel>(RouterStateName);

export const getCurrentRouteDataSelector = createSelector(_getRouterState, (router)=>{
    return router
})
