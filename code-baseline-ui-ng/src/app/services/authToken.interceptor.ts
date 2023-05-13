import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { exhaustMap, Observable, take } from "rxjs";
import { getAuthTokenSelector } from "../components/auth/state/auth.selector";
import { AppState } from "../store/app.state";

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor{
    constructor(private store : Store<AppState>){}
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
        ): Observable<HttpEvent<any>>{
            //Get token
            return this.store.select(getAuthTokenSelector)
            .pipe(
                take(1), // take one time, else will keep taking token and will affect logout functionality
                exhaustMap((token)=>{
                if(!token){
                    return next.handle(req);
                }
                let modifiedReq = req.clone({
                    headers : req.headers.set('Authorization', `Bearer ${token}`)
                });
                return next.handle(modifiedReq);
            }))
        
    }    
}
 