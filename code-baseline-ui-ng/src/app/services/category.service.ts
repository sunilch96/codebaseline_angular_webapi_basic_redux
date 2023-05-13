import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { AppConstants } from "../data/appConstants";
import { CategoryModel } from "../models/categoryModel";

@Injectable({
    providedIn:'root'
})
export class CategoryService{
    constructor(private httpClient : HttpClient){}
    baseUrl:string = AppConstants.baseApiUrl;

    getCategories():Observable<CategoryModel[]>{
        return this.httpClient.get<CategoryModel[]>(this.baseUrl + 'api/Category' )
        .pipe(map((data:CategoryModel[])=>{
            const categoryList = <CategoryModel[]>data            
            return categoryList;
        }))
    }
}