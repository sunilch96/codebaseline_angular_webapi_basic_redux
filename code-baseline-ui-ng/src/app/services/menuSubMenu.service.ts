import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { AppConstants } from "../data/appConstants";
import { MenuSubMenuModel } from "../models/menuSubMenuModel";

@Injectable({
    providedIn:'root'
})
export class MenuSubMenuService{
    constructor(private httpClient : HttpClient){}
    baseUrl:string = AppConstants.baseApiUrl;

    getMenuSubMenu():Observable<MenuSubMenuModel[]>{
        return this.httpClient.get(this.baseUrl + 'api/MenuMaster' )
        .pipe(map((data)=>{
            const postList = <MenuSubMenuModel[]>data
            return postList;
        }))
    }

    getMenuSubMenuById(id:number):Observable<MenuSubMenuModel>{
        return this.httpClient.get<MenuSubMenuModel>(this.baseUrl + 'api/MenuMaster/'+ id );
    }

    addMenuSubMenu(menuSubMenuData:MenuSubMenuModel){
        return this.httpClient.post<any>(this.baseUrl + 'api/MenuMaster', menuSubMenuData)
    }

    updateMenuSubMenu(menuSubMenuData:MenuSubMenuModel){
        return this.httpClient.put(this.baseUrl + 'api/MenuMaster/'+ menuSubMenuData.menuId, menuSubMenuData)
    }

    deleteMenuSubMenu(id: number){
        return this.httpClient.delete(this.baseUrl + 'api/MenuMaster/'+ id)
    }
}