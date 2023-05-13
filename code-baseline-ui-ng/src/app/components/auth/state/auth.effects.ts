import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, exhaustMap, map, mergeMap, of, tap } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { AppState } from "src/app/store/app.state";
import { SetErrorMessageAction, SetLoadingSpinnerAction } from "../../shared/state/shared.actions";
import { AutoLoginAction, LoginStartAction, LoginSuccessAction, LogOutUserAction, SignUpStartAction, SignUpSuccessAction } from "./auth.action";

@Injectable()
export class AuthEffects{
    constructor(
        private actions$ : Actions,
        private authServie : AuthService,
        private store: Store<AppState>,
        private route: Router){}

    //sign in effect + redirect effect
    //this effect will listen for LoginStartAction, if its executed then it will call service
    login$ = createEffect(()=> {        
        return this.actions$.pipe(ofType(LoginStartAction),
        //The reason to use 'exhaustMap' is that the values from the source observables 
        //are ignored as long as the inner observable is still in progress.
        //EX: continous clicking button triggers to call service many times 
        //but exhaustMap prevents it, its ignores unless current is finished
        exhaustMap((action)=>{
            return this.authServie.login(action.email, action.password)
            .pipe(
                map((data)=>{
                //hide spinner
                this.store.dispatch(SetLoadingSpinnerAction({status:false}));
                //hide error message
                this.store.dispatch(SetErrorMessageAction({message: ''}))
                const user = this.authServie.formatUser(data);
                this.authServie.saveUserToLocalStorage(user);
                return LoginSuccessAction({user, redirect:true})
            }),
            catchError((error)=>{
                console.log(error);
                this.store.dispatch(SetLoadingSpinnerAction({status:false}));
                let errorMsg:string = '';
                if(error?.error?.title){
                    errorMsg = this.authServie.getErrorMessage(error.error.title);
                }
                else if(error?.error?.message){
                    errorMsg = this.authServie.getErrorMessage(error.error.message);
                }
                else if(error?.statusText){
                    errorMsg = this.authServie.getErrorMessage(error.statusText);
                }
                else{
                    errorMsg = this.authServie.getErrorMessage('');;
                }          
                return of(SetErrorMessageAction({message: errorMsg}));
            })
            )
        }))        
    })
    //login redirect - effect
    loginRedirect$ = createEffect(()=>{
        return this.actions$.pipe(ofType(LoginSuccessAction),
        //tap will not return any action, it will just do work
        tap((action)=>{            
            if(action.redirect){
                this.route.navigate(['/'])
                // .then(() => {
                //     //need to reload, was causing error for login and immediately logout
                //     window.location.reload();
                //   });
            }            
        })
        )
    }, {dispatch:false})


    //sign up effect + redirect effect
    signUp$ = createEffect(()=>{
        return this.actions$.pipe(ofType(SignUpStartAction),
        //The reason to use 'exhaustMap' is that the values from the source observables 
        //are ignored as long as the inner observable is still in progress.
        //EX: continous clicking button triggers to call service many times 
        //but exhaustMap prevents it, its ignores unless current is finished
        exhaustMap((action)=>{
            return this.authServie.signUp(action.userName, action.email, action.password)
            .pipe(map((data)=>{
                //hide spinner
                this.store.dispatch(SetLoadingSpinnerAction({status:false}));
                //hide error message
                this.store.dispatch(SetErrorMessageAction({message: ''}))
                const user = this.authServie.formatUser(data);
                return SignUpSuccessAction({user})
            }),
            catchError((error)=>{
                console.log(error);
                this.store.dispatch(SetLoadingSpinnerAction({status:false}));
                let errorMsg:string = '';
                if(error?.error?.title){
                    errorMsg = this.authServie.getErrorMessage(error.error.title);
                }
                else if(error?.error?.message){
                    errorMsg = this.authServie.getErrorMessage(error.error.message);
                }
                else if(error?.statusText){
                    errorMsg = this.authServie.getErrorMessage(error.statusText);
                }
                else{
                    errorMsg = this.authServie.getErrorMessage('');;
                }
                return of(SetErrorMessageAction({message: errorMsg}));
            })
            )
        })
        )
    });

    //sign up - redirect effect
    signUpRedirect$ = createEffect(()=>{
        return this.actions$.pipe(ofType(SignUpSuccessAction),
        //tap will not return any action, it will just do work
        tap((action)=>{
            console.log(action)
            this.route.navigate(['/auth'], { state : { userName : action?.user.email}})
        })
        )
    }, {dispatch:false})

    autoLogin$ = createEffect(()=>{
        return this.actions$.pipe(ofType(AutoLoginAction),
        mergeMap((action)=>{
            const user = this.authServie.getUserFromLocalStorage();            
            return of(LoginSuccessAction({user, redirect:false}));
        })
        )
    })

    logoutUser$ = createEffect(()=>{
        return this.actions$.pipe(ofType(LogOutUserAction),
        map((action)=>{
            this.authServie.logOutUser();
            this.store.dispatch(SetLoadingSpinnerAction({status:false}));
            this.route.navigate(['/auth']);
        })
        )
    }, {dispatch:false})
}