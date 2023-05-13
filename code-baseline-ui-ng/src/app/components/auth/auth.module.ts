import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { LoginComponent } from "./login/login.component";
import { AuthEffects } from "./state/auth.effects";
import { AuthReducer } from "./state/auth.reducer";
import { AuthStateName } from "./state/auth.selector";
import { SignupComponent } from './signup/signup.component';

const authRoutes:Routes=[
    {
        path:'',
        children:[
            {path:'', redirectTo:'login', pathMatch:'full'},
            {path:'login', component:LoginComponent},
            {path:'signup', component:SignupComponent},
        ]
    }
]
@NgModule({
    declarations:[        
        LoginComponent, SignupComponent
    ],
    imports:[
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(authRoutes)
    ]
})
export class AuthModule{

}