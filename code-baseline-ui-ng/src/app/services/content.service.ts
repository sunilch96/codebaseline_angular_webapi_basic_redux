import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { AppConstants } from "../data/appConstants";
import { ContentModel } from "../models/content.model";

@Injectable({
    providedIn:'root'
})
export class ContentService{
    constructor(private httpClient : HttpClient){}
    baseUrl:string = AppConstants.baseApiUrl;

    getContentById(menuId:number, courseId:number ):Observable<ContentModel>{
        return this.httpClient.get<ContentModel>(this.baseUrl + 'api/content/'+ menuId + "/" + courseId );
    }

    //add content against courseId
    addContent(postData:ContentModel){
        return this.httpClient.post<ContentModel>(this.baseUrl + 'api/content', postData)
    }

    deleteContent(menuId:number, courseId:number){
        return this.httpClient.delete(this.baseUrl + 'api/content/'+ menuId + "/" + courseId )
    }
}