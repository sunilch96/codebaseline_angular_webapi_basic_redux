import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Store } from "@ngrx/store";
import { exhaustMap, map, Observable } from "rxjs";
import { getIsAuthenticatedStateSelector } from "../components/auth/state/auth.selector";
import { AppState } from "../store/app.state";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate{
    constructor(private store: Store<AppState>, private router : Router){}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
        ): Observable<boolean 
        | UrlTree>  | Promise<boolean 
        | UrlTree> | boolean | UrlTree{
            return this.store.select(getIsAuthenticatedStateSelector)
            .pipe(map((auth)=>{
                if(!auth){
                    //createUrlTree : to create new url tree, 
                    //removes old path segments, params
                    return this.router.createUrlTree(['/auth']);
                }
                return true;
            }))
    }
}