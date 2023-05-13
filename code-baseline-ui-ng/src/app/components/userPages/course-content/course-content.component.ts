import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription, tap } from 'rxjs';
import { ContentModel } from 'src/app/models/content.model';
import { MenuSubMenuModel } from 'src/app/models/menuSubMenuModel';
import { ContentService } from 'src/app/services/content.service';
import { CourseTilesService } from 'src/app/services/courseTiles.service';
import { AppState } from 'src/app/store/app.state';
import { SetLoadingSpinnerAction } from '../../shared/state/shared.actions';

@Component({
  selector: 'app-course-content',
  templateUrl: './course-content.component.html',
  styleUrls: ['./course-content.component.scss']
})
export class CourseContentComponent implements OnInit, OnDestroy{
  constructor(private store: Store<AppState>,
    private contentService : ContentService,
    private courseTilesService: CourseTilesService,
    private currentRoute : ActivatedRoute,
    private router: Router){
    }

    ngOnInit(): void {      
      this.currentRoute.params.subscribe(params => {
        if (params['courseId']) {
          this.courseId = params['courseId'];
        }
        this.getMenuIdFromUrl();
        this.getContent(this.menuId,this.courseId);
        this.getCourseTitleAndMenuData();
      });
    }
    ngOnDestroy(): void {
      if(this.courseTilesServiceSubscription){
        this.courseTilesServiceSubscription.unsubscribe();
      }
      if(this.contentServiceSubscription){
        this.contentServiceSubscription.unsubscribe();
      }
    }

    menuId:number=0;
    courseId:number;
    menuSubMenu$ : Observable<MenuSubMenuModel>;
    menuCourseTiles : MenuSubMenuModel;
    courseContentData : ContentModel;
    courseTilesServiceSubscription: Subscription;
    contentServiceSubscription : Subscription;
    
    getMenuIdFromUrl(){
      if(this.router.url.split('/').length==4){
        this.menuId = parseInt(this.router.url.split('/')[this.router.url.split('/').length - 2 ])
      }
    }

    getCourseTitleAndMenuData(){
      if(this.courseId == 0 || !this.courseId){
        return;
      }
        this.courseTilesServiceSubscription =  this.courseTilesService.getCourseTileByMenuIdAndCourseId(this.menuId, this.courseId)
        .pipe(tap(x=>{
          this.store.dispatch(SetLoadingSpinnerAction({status:true}))
        }))
        .subscribe( (data)=>{
           this.menuCourseTiles = data;         
          },
          (error)=>{
            console.log(error);
            this.store.dispatch(SetLoadingSpinnerAction({status:false}));
          },
          ()=>{
            this.store.dispatch(SetLoadingSpinnerAction({status:false}))
          } );
        
        //this.menuSubMenu$ = this.menuService.getMenuSubMenuById(this.courseId);
  
    }
  
    getContent(menuId, courseId){      
      this.contentServiceSubscription = this.contentService.getContentById(menuId, courseId)
      .pipe(tap(x=>{
        this.store.dispatch(SetLoadingSpinnerAction({status:true}))
      }))
      .subscribe((data)=>{
        this.courseContentData = data;
      },
      (error)=>{
        this.courseContentData = null;
        this.store.dispatch(SetLoadingSpinnerAction({status:false}))
      },
      ()=>{
        this.store.dispatch(SetLoadingSpinnerAction({status:false}))
      })
    }

}
