import { createAction, props } from "@ngrx/store";

export const SET_LOADING_SPINNER = "SET_LOADING_SPINNER";
export const SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE";

export const SetLoadingSpinnerAction = createAction(SET_LOADING_SPINNER, props<{status:boolean}>());
export const SetErrorMessageAction = createAction(SET_ERROR_MESSAGE, props<{message:string}>())