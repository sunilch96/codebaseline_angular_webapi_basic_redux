import { createAction, props } from "@ngrx/store";
import { CategoryModel } from "src/app/models/categoryModel";

const LOAD_CATEGORY_ACTION = "LOAD_CATEGORY_ACTION";
const LOAD_CATEGORY_SUCCESS_ACTION = "LOAD_CATEGORY_SUCCESS_ACTION";
export const LoadCategoryAction = createAction(LOAD_CATEGORY_ACTION);
export const LoadCategorySuccessAction = createAction(LOAD_CATEGORY_SUCCESS_ACTION, 
    props<{categories: CategoryModel[]}>());