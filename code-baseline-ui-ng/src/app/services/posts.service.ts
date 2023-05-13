import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { AppConstants } from "../data/appConstants";
import { PostModel } from "../models/post.model";


@Injectable({
    providedIn:'root'
})
export class PostsService{
    constructor(private httpClient : HttpClient){}
    baseUrl:string = AppConstants.baseApiUrl;

    getPosts():Observable<PostModel[]>{
        return this.httpClient.get(this.baseUrl + 'api/Post' )
        .pipe(map((data)=>{
            const postList = <PostModel[]>data
            return postList;
        }))
    }

    getPostById(id:number):Observable<PostModel>{
        return this.httpClient.get<PostModel>(this.baseUrl + 'api/Post/'+ id );
    }

    addPost(postData:PostModel){
        return this.httpClient.post<PostModel>(this.baseUrl + 'api/Post', postData)
    }

    updatePost(postData:PostModel){
        return this.httpClient.put(this.baseUrl + 'api/Post/'+ postData.id, postData)
    }

    deletePost(id: number){
        return this.httpClient.delete(this.baseUrl + 'api/Post/'+ id)
    }
}