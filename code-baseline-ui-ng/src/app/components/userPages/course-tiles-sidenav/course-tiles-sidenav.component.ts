import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, tap } from 'rxjs';
import { CourseTilesModel } from 'src/app/models/courseTilesModel';
import { MenuSubMenuModel } from 'src/app/models/menuSubMenuModel';
import { CourseTilesService } from 'src/app/services/courseTiles.service';
import { AppState } from 'src/app/store/app.state';
import { SetLoadingSpinnerAction } from '../../shared/state/shared.actions';

@Component({
  selector: 'app-course-tiles',
  templateUrl: './course-tiles-sidenav.component.html',
  styleUrls: ['./course-tiles-sidenav.component.scss'],
  //providers:[CourseTilesService]
  //encapsulation: ViewEncapsulation.None
})
export class CourseTilesComponent implements OnInit, OnDestroy{
  constructor(
    private courseTilesService: CourseTilesService,
    private store: Store<AppState>,
    private currentRoute : ActivatedRoute,
    private router:Router){}

  ngOnInit(): void {
    this.currentRoute.params.subscribe(params => {
      if (params['menuId']) {
        this.selectedMenuId = params['menuId'];
      }
      this.getAllCourseTilesData();
    });
  }
  ngOnDestroy(): void {
    if(this.courseTilesServiceSubscription){
      this.courseTilesServiceSubscription.unsubscribe();
    }
  }
  menuCourseTiles : MenuSubMenuModel;
  firstCourseTilesFromSideNav : CourseTilesModel;
  courseTilesServiceSubscription: Subscription;
  count:number = 0;
  selectedMenuId:number;

  getAllCourseTilesData(){ 
    if(!this.selectedMenuId){
      return;
    }

    this.courseTilesServiceSubscription = this.courseTilesService.getCourseTilesByMenuId(this.selectedMenuId)
    .pipe(tap(x=>{
      this.store.dispatch(SetLoadingSpinnerAction({status:true}))
    }))
    .subscribe((data)=>{      
      this.menuCourseTiles = data;
      this.createCourseSideTiles(this.menuCourseTiles);
      this.navigateToFirstPage();
    },
    (e)=>{
      this.menuCourseTiles = null;
      this.store.dispatch(SetLoadingSpinnerAction({status:false}))
    },
    ()=>{
      this.store.dispatch(SetLoadingSpinnerAction({status:false}))
    });
  }  
  
  createCourseSideTiles(menuCourseTilesData: MenuSubMenuModel){
    if(menuCourseTilesData == null || menuCourseTilesData.courseTiles == null){
      return;
    }
    var ulFirst = document.createElement("ul");
    ulFirst.className = "navbar-nav";
    
    for(let items of menuCourseTilesData.courseTiles){
      var li = document.createElement("li");
      li.style.borderTop = "1px solid";
      li.style.borderTopColor = "rgba(129, 129, 129, 0.2)";
      li.className ="noBorderOnlyTop rounded-0";

      if(items.childSubCourses){
        this.createSubCourseSideTiles(li, items);
      }
      else{
        this.count++;
        if(this.count == 1){
          this.firstCourseTilesFromSideNav = items;
        }

        var a = document.createElement("a");
        a.style.cursor = "pointer";
        a.className ="nav-link px-1";
        a.setAttribute("coursenames", "coursenames_"+ items.courseId );
        a.addEventListener("click",(e)=> { this.viewContent(items)} );
        a.innerHTML = items.name + "ghg";
        li.append(a);
      }

      ulFirst.append(li);
    }
    var sideNavDivContainer = document.getElementById("sideNavDivContainer");
      while (sideNavDivContainer?.firstChild) {
        sideNavDivContainer.firstChild.remove()
      }
      sideNavDivContainer.append(ulFirst);
      //this.sideNavDivContainerHtmlString  = ulFirst.innerHTML;
  }

  createSubCourseSideTiles(_li, data:CourseTilesModel){
    //a, span, span, ,span, i
    var _li_a = document.createElement("a");
    _li_a.style.display = "flex";
    _li_a.className = "nav-link px-1 sidebar-link";
    _li_a.setAttribute("data-bs-toggle", "collapse");
    _li_a.href = "#collapse"+data.courseId;
    
      var _li_a_span = document.createElement("span");
      _li_a_span.className = "capitalizeText";
      _li_a_span.innerHTML = data.name;
    _li_a.append(_li_a_span);

        var _li_a_spanChevron = document.createElement("span");
        _li_a_spanChevron.className = "ms-auto";
          var _li_a_spanChevronSpan_icon = document.createElement("span");
          _li_a_spanChevronSpan_icon.className = "right-icon";
            var _li_a_spanChevron_icon = document.createElement("i");
            _li_a_spanChevron_icon.className = "bi bi-chevron-down";
          _li_a_spanChevronSpan_icon.append(_li_a_spanChevron_icon);
        _li_a_spanChevron.append(_li_a_spanChevronSpan_icon);
    _li_a.append(_li_a_spanChevron);

    _li.append(_li_a);

    var div = document.createElement("div");
    div.className = "collapse show";
    div.id = "collapse" + String(data.courseId);

    var ul = document.createElement("ul");
    ul.className = "navbar-nav";      
    
    for(let item of data.childSubCourses){
      this.count++;
      if(this.count == 1){
        this.firstCourseTilesFromSideNav = item;
      }

      var li = document.createElement("ul");
      if(item.childSubCourses){
        this.createSubCourseSideTiles(li, item);
      }
      else{
        var a = document.createElement("a");
        a.style.cursor ="pointer";
        a.className = "nav-link capitalizeText";
        a.setAttribute("coursenames", "coursenames_"+item.courseId);
        a.addEventListener("click",(e)=> { this.viewContent(item)} );
        a.innerHTML = item.name;
        li.append(a);
        ul.append(li);
      }
    }

    div.append(ul);
    _li.append(div);
  }

  navigateToFirstPage(){
    if(!this.firstCourseTilesFromSideNav){
      return;
    }
    this.viewContent(this.firstCourseTilesFromSideNav);
    //navigate to first course page
  }
  viewContent( item:CourseTilesModel){
    //remove active class
    document.querySelectorAll('[coursenames]').forEach((e) => {
      e.classList.remove("active");
    });

    //add active class to this element
    document.querySelectorAll(`[coursenames="coursenames_${item.courseId}"]`)
    .forEach((e) => {
      e.classList.add("active");
    });

    var navUrl = "/course/" + this.selectedMenuId + "/" + item.courseId
    this.navigateToContent(navUrl);
  }
  navigateToContent(routeUrl){    
    this.router.navigate([routeUrl], {state: {menuId : this.selectedMenuId}})
  }
}
