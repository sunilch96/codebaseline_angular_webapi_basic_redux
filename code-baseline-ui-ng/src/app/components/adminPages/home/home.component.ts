import { Component, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CategoryModel } from 'src/app/models/categoryModel';
import { AppState } from 'src/app/store/app.state';
import { LoadCategoryAction } from '../state/admin.actions';
import { getCategoriesStateSelector } from '../state/admin.selector';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private storeService : Store<AppState>){
  }
  
  public getScreenInnerWidth: any;    
  ngOnInit() {
    this.storeService.dispatch(LoadCategoryAction());    
    this.getScreenInnerWidth = window.innerWidth ;      
  }
  
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenInnerWidth = window.innerWidth;    
  }

  ifScreenSize =():boolean=>{
    return this.getScreenInnerWidth >= 992 ? true:false
  }
}
