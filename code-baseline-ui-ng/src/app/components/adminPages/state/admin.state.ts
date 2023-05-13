import { AdminModel } from "src/app/models/admin.model"
import { CategoryModel } from "src/app/models/categoryModel"


export interface AdminState{
    admin:AdminModel[],
    categories: CategoryModel[]
}

export const adminInitialState:AdminState ={
    admin:[],
    categories:[]
}