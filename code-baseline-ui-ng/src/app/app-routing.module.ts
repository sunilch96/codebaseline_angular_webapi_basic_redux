import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/userPages/home/home.component';
import { AuthGuard } from './services/auth.guard';
 
const routes: Routes = [
  {
    path:"",
    loadChildren: ()=>import('./components/userPages/userPage.module').then(m=> m.UserPagesModule),
  },  
  {
    path:'auth',
    loadChildren: ()=> import('./components/auth/auth.module').then(m=>m.AuthModule)
  },
  {
    path:"admin",
    loadChildren: ()=>import('./components/adminPages/admin.module').then(m=> m.AdminModule),
    canActivate : [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
