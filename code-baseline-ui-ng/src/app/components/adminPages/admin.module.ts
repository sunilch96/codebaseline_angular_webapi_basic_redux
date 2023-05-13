import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { HomeComponent } from "./home/home.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { SkillsComponent } from "./skills/skills.component";
import { UsersComponent } from "./users/users.component";
import { AdminStateName } from "./state/admin.selector";
import { AdminEffects } from "./state/admin.effects";
import { adminReducer } from "./state/admin.reducer";
import { SidenavComponent } from './pages/sidenav/sidenav.component';
import { TopnavComponent } from './pages/topnav/topnav.component';
import { MenuMasterComponent } from './menu-master/menu-master.component';
import { CourseContentComponent } from './course-content/course-content.component';
import { QuillModule } from "ngx-quill";
import { CourseTilesComponent } from './course-tiles/course-tiles.component';

const postRoutes : Routes = [
    {
        path:"",
        component:HomeComponent ,        
        children:[
        {
            path:'dashboard', component:DashboardComponent
        },
        {
            path:'skills', component:SkillsComponent
        },
        {
            path:'menu', component:MenuMasterComponent
        },
        {
            path:'coursetiles/:menuId', component:CourseTilesComponent
        },
        {
            path:'content/:menuId/:courseId', component:CourseContentComponent
        },
        
        {
            path:'users', component:UsersComponent
        }
        ]
    }
]
@NgModule({
    declarations:[
        HomeComponent,
        DashboardComponent,
        SkillsComponent,
        UsersComponent,
        SidenavComponent,
        TopnavComponent,
        MenuMasterComponent,
        CourseContentComponent,
        CourseTilesComponent                
    ],
    imports:[
        CommonModule,
        ReactiveFormsModule,
        QuillModule,
        RouterModule.forChild(postRoutes),
        StoreModule.forFeature(AdminStateName, adminReducer),
        EffectsModule.forFeature([AdminEffects])
    ]
})
export class AdminModule{

}