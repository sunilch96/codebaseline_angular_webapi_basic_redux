import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { AppConstants } from "../data/appConstants";
import { CourseTilesModel } from "../models/courseTilesModel";
import { MenuSubMenuModel } from "../models/menuSubMenuModel";

@Injectable({
    providedIn:'root'
})
export class CourseTilesService{
    constructor(private httpClient : HttpClient){}
    baseUrl:string = AppConstants.baseApiUrl;

    getCourseTiles():Observable<CourseTilesModel[]>{
        return this.httpClient.get(this.baseUrl + 'api/CourseTilesMaster' )
        .pipe(map((data)=>{
            const courseTileData = <CourseTilesModel[]>data
            return courseTileData;
        }))
    }

    getCourseTilesByMenuId(id:number):Observable<MenuSubMenuModel>{
        return this.httpClient.get<MenuSubMenuModel>(this.baseUrl + 'api/CourseTilesMaster/'+ id );
    }

    getCourseTileByMenuIdAndCourseId(menuId:number, courseId:number):Observable<MenuSubMenuModel>{
        return this.httpClient.get<MenuSubMenuModel>(this.baseUrl + 'api/CourseTilesMaster/course/'+ menuId +"/" + courseId);
    }

    addCourseTiles(courseTileData:CourseTilesModel){
        return this.httpClient.post<any>(this.baseUrl + 'api/CourseTilesMaster', courseTileData)
    }

    updateCourseTiles(courseTileData:CourseTilesModel){
        return this.httpClient.put(this.baseUrl + 'api/CourseTilesMaster/'+ courseTileData.courseId, courseTileData)
    }

    deleteCourseTiles(id: number){
        return this.httpClient.delete(this.baseUrl + 'api/CourseTilesMaster/'+ id)
    }
}