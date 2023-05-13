import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { CourseContentComponent } from "./course-content/course-content.component";
import { CourseTilesComponent } from "./course-tiles-sidenav/course-tiles-sidenav.component";
import { HomeComponent } from "./home/home.component";
import { MenubarComponent } from "./menubar/menubar.component";
import { SanitizeHtmlPipe } from "./sanitize-html.pipe";
import { CourseTilesService } from "src/app/services/courseTiles.service";

const postRoutes : Routes = [
    {
        path:"",
        component: HomeComponent,
        children:[
        {
            path:'course/:menuId', component:CourseTilesComponent,
            children:[
                {
                    path:':courseId', component:CourseContentComponent
                }
            ]
        }        
        ]
    }
]
@NgModule({
    declarations:[
        HomeComponent,
        MenubarComponent,
        CourseTilesComponent,
        CourseContentComponent,
        SanitizeHtmlPipe
    ],
    imports:[
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(postRoutes),
    ],
    providers:[
        //CourseTilesService
    ]
})
export class UserPagesModule{

}