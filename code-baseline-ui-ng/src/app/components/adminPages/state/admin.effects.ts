import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, filter, map, mergeMap, of, switchMap, tap } from "rxjs";
import { CategoryModel } from "src/app/models/categoryModel";
import { CategoryService } from "src/app/services/category.service";
import { LoadCategoryAction, LoadCategorySuccessAction } from "./admin.actions";

@Injectable()
export class AdminEffects{
    constructor(
        private actions$:Actions,       
        private router:Router,
        private categoryService: CategoryService){}

        loadCategories$ = createEffect( ()=> {
            return this.actions$.pipe(ofType(LoadCategoryAction),
                mergeMap((action)=>{
                    return this.categoryService.getCategories()
                    .pipe(map((data:CategoryModel[])=>{
                        return LoadCategorySuccessAction({categories : data})
                    }))
                })
            )
        }
    );

    
}