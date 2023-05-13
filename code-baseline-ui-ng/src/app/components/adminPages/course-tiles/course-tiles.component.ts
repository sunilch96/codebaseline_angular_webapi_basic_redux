import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription, tap } from 'rxjs';
import { CategoryModel } from 'src/app/models/categoryModel';
import { CourseTilesModel } from 'src/app/models/courseTilesModel';
import { MenuSubMenuModel } from 'src/app/models/menuSubMenuModel';
import { CourseTilesService } from 'src/app/services/courseTiles.service';
import { AppState } from 'src/app/store/app.state';
import { SetLoadingSpinnerAction } from '../../shared/state/shared.actions';
import { getCategoriesStateSelector } from '../state/admin.selector';

@Component({
  selector: 'app-course-tiles',
  templateUrl: './course-tiles.component.html',
  styleUrls: ['./course-tiles.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CourseTilesComponent implements OnInit, OnDestroy{
  constructor(
    private courseTilesService: CourseTilesService,   
    private router:Router,
    private store: Store<AppState>,
    private currentRoute : ActivatedRoute){}
    
  //categoriesList$ : Observable<CategoryModel[]>;  
  categoriesSubscription : Subscription;

  ngOnInit(): void {
    //this.selectedMenuId = this.currentRoute.snapshot.params['menuId'];
    //this.categoriesList$ = this.storeService.select(getCategoriesStateSelector);
    //this.getAllCourseTilesData();
    
    this.currentRoute.params.subscribe(params => {
      if (params['menuId']) {
        this.selectedMenuId = params['menuId'];
      }
      this.getAllCourseTilesData();
    });

    this.courseTileFormGroup = new FormGroup({      
      name: new FormControl(null,[
        Validators.required,
        Validators.minLength(5)
      ]),
      description: new FormControl(null,[
        Validators.required,
        Validators.minLength(5)
      ]),
      categories: new FormControl('-1'), // default value
      courseId: new FormControl(null),
      subCourseId: new FormControl(null),
      sequenceNumber: new FormControl(null),
      sortByDescending: new FormControl(),
      url: new FormControl(null),
      enabled: new FormControl(true),
      created: new FormControl(true),
      updated: new FormControl(true)
    });    
  }

  ngOnDestroy(): void {
    if(this.categoriesSubscription){
      this.categoriesSubscription.unsubscribe();
    }
  }
  selectedMenuId:number;
  menuCourseTiles : MenuSubMenuModel;
  courseTileFormGroup: FormGroup;  
  
  getAllCourseTilesData(){

    if(this.selectedMenuId == 0 || !this.selectedMenuId){
      return;
    }

    this.courseTilesService.getCourseTilesByMenuId(this.selectedMenuId)
    .pipe(tap(x=>{
      this.store.dispatch(SetLoadingSpinnerAction({status:true}))
    }))
    .subscribe((data)=>{
      this.menuCourseTiles = data;
      console.log(data);
      this.getCourseTiles(this.menuCourseTiles.courseTiles);
      this.toggleMenus();
      this.expandCollapseMenu();
    },
    (e)=>{
      this.store.dispatch(SetLoadingSpinnerAction({status:false}))
    },
    ()=>{
      this.store.dispatch(SetLoadingSpinnerAction({status:false}))
    });
  }

  //this will add event to element having caret class name, as it will toggle open close of sub-menus
  toggleMenus(){
    var toggler = document.getElementsByClassName("caret");
      for (var i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function() {
          this.parentElement.querySelector(".nested").classList.toggle("active");
          this.classList.toggle("caret-down");
        });
      }
  }
  
  expandCollapseMenu(){
    document.querySelectorAll('[collapsemenu]').forEach((element) => {
      element.parentElement.querySelector(".nested").classList.toggle("active");
            element.classList.toggle("caret-down");
    });
  }

  getCourseTiles(data:CourseTilesModel[]){
    var ul = document.createElement("ul");
    ul.className = "list-group list-group-numbered";

    for (let i = 0; i < data.length ; i++) {
      var currentItem = data[i];
      var li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-start";
        var div1 = document.createElement("div");
          div1.className = "ms-2 me-auto fullWidth";
          var div2 = document.createElement("div");
            

          var div1_div = document.createElement("div");
            div1_div.className = "displaySpaceBetween bg-light";

            var div1_span = document.createElement("span");
              div1_span.innerHTML = currentItem.name;
              div1_span.className = "parentTitleSpan";
              
                var span_small = document.createElement("small");
                  var small_i = document.createElement("i");
                  small_i.className = "parentCategoryName";                 

                  span_small.append(small_i);
                div1_span.append(span_small);
                
                div1_div.append(div1_span);
                div1_div.append(this.buttonGroup(currentItem, '', true));

            div1.append(div1_div);

            div1.append(div2);
      
      if(currentItem.childSubCourses){
         //first UL
        var firstUl = document.createElement("ul");
        firstUl.className = "menuUL list-group";
        var firstLI = document.createElement("li");
        firstLI.className = "menuUL list-group";
          
        var liCaret = document.createElement("span");
          liCaret.className = "caret";
          liCaret.innerHTML = currentItem.name;
          liCaret.id = "caret_" + currentItem.courseId;
          liCaret.setAttribute("collapsemenu", "collapsemenu_" + currentItem.menuId);
          liCaret.setAttribute("parent", "parent");
          
          var span = document.createElement("span");
            span.className = "courseCount ms-3 badge bg-primary rounded-pill";
            span.innerHTML = String(currentItem.childSubCourses.length);
            liCaret.append(span);

          firstLI.append(liCaret);        
        firstUl.append(firstLI);

        this.addChildCourseTile(firstLI, currentItem, currentItem.childSubCourses);
        div1.append(firstUl);
        li.append(div1);
        ul.append(li);
      }
      else{        
        li.append(div1);
        ul.append(li);
      }      
    }
    //remove previous html before append
    var courseCourseTile = document.getElementById("courseCourseTile");
      while (courseCourseTile?.firstChild) {
        courseCourseTile.firstChild.remove()
      }
      courseCourseTile.append(ul);   
  }

  addChildCourseTile(element, currentItem, data:CourseTilesModel[]){
    var ul = document.createElement("ul");
    ul.className = "nested list-group";
    var count = 0;
    for(let item of data){
      count++
      var li = document.createElement("li");
      li.className = "list-group-item";
      
      if(item.childSubCourses){
        var spanCaret = document.createElement("span");
        spanCaret.className = "caret";
        spanCaret.innerHTML = item.name;
        spanCaret.id = "caret_" + item.courseId;
        spanCaret.setAttribute("collapsemenu", "collapsemenu_" + currentItem.menuId);
        li.append(spanCaret);

        var span = document.createElement("span");
        span.className = "ms-3 badge bg-primary rounded-pill";
        span.innerHTML = String(item.childSubCourses.length);

        li.append(span);
        //pass css: buttonsForMenuWitChild
        li.append(this.buttonGroup(item, 'buttonsForMenuWitChild'));
        this.addChildCourseTile(li, item, item.childSubCourses);
        ul.append(li)
        
      }
      else{     
        if(count % 2 ==0){
          li.className = "backGroundColourOnHover list-group-item list-group-item-secondary";
        }
        else{
          li.className = "backGroundColourOnHover list-group-item";
        }
        li.append(this.buttonsForCourseTileWithoutChild(item))
        ul.append(li);
      }
    }

   //apped New UL to first LI
   element.append(ul);
  }

  buttonsForCourseTileWithoutChild(item:CourseTilesModel){
    var div = document.createElement('div');
    div.className = "displaySpaceBetween";

    var divCourseName = document.createElement('div');    
    divCourseName.className = "divCourseName";
      var span = document.createElement('span');
      span.innerHTML = item.name;

      var small = document.createElement('small');
      if(item.isContentAvailable){
        small.innerHTML = "Content Available";
        small.className = "divCourseNameSmall text-success";
      }
      else{
        small.innerHTML = "No Content Available";
        small.className = "divCourseNameSmall text-danger";
      }
      

    divCourseName.append(span);
    divCourseName.append(small);

    div.append(divCourseName);
    div.append(this.buttonGroup(item));
    return div;
  }
  
  buttonGroup(item:CourseTilesModel, cssClass = '', isCalledFromFirstMenu = false){

    //Menu Buttons
    var divMenuBtnGroup = document.createElement('div');
    divMenuBtnGroup.className = "btn-group btn-group-sm " + cssClass;
    divMenuBtnGroup.setAttribute("role","group");
    divMenuBtnGroup.setAttribute("aria-label","Modify Menu");

    var buttonAdd = document.createElement('button');
    buttonAdd.className = "btn btn-xs btn-primary";
    buttonAdd.type = "button";
    buttonAdd.title = "Add Child Menu";
    buttonAdd.addEventListener("click",(e)=> { this.addCourseTile(item)} );
      var addIcon = document.createElement('i');
      addIcon.className = "bi bi-plus-circle";
      buttonAdd.append(addIcon)
    
    var buttonEdit = document.createElement('button');
    buttonEdit.className = "btn btn-xs btn-warning";
    buttonEdit.type = "button";
    buttonEdit.title = "Edit this menu";
    buttonEdit.addEventListener("click",(e)=> { this.editCourseTile(item)} );
      var editIcon = document.createElement('i');
      editIcon.className = "bi bi-pencil-square";
      buttonEdit.append(editIcon)

    var buttonDelete = document.createElement('button');
    buttonDelete.className = "btn btn-xs btn-danger";
    buttonDelete.type = "button";
    buttonDelete.title = "Delete this menu";
    buttonDelete.addEventListener("click",(e)=> { this.deleteCourseTile(item)} );
    var deleteIcon = document.createElement('i');
      deleteIcon.className = "bi bi-trash3";
      buttonDelete.append(deleteIcon)
    
      divMenuBtnGroup.append(buttonAdd);
      divMenuBtnGroup.append(buttonEdit);
      divMenuBtnGroup.append(buttonDelete);

    var span = document.createElement('span');
    span.className = "buttonGroupSpan";
    span.innerHTML = "Course Tiles";    

    var divMenuGroup = document.createElement('div');
    divMenuGroup.className = "buttonGroupDiv";
    divMenuGroup.append(span);
    divMenuGroup.append(divMenuBtnGroup);
    
    //Combine Button Groups
    var divCombinedGroup = document.createElement('div');
    if(item.childSubCourses && !isCalledFromFirstMenu){
      divCombinedGroup.className = "backGroundColourOnHover divCombinedGroup divMenuHavingChildren";
    }
    else{
      divCombinedGroup.className = "backGroundColourOnHover divCombinedGroup";
    }
   
    divCombinedGroup.append(divMenuGroup);

    if(!item.childSubCourses){
      divCombinedGroup.append(this.contentButtonGroup(item, cssClass));    
    }
    return divCombinedGroup;
  }

  contentButtonGroup(item:CourseTilesModel, cssClass = ''){
    //icons    
    var deleteIcon = document.createElement('i');
      deleteIcon.className = "bi bi-trash3";
    var viewIcon = document.createElement('i');
      viewIcon.className = "bi bi-credit-card-2-front";
      
     //content Buttons
     var divContentBtnGroup = document.createElement('div');
     divContentBtnGroup.className = "btn-group btn-group-sm " + cssClass;
     divContentBtnGroup.setAttribute("role","group");
     divContentBtnGroup.setAttribute("aria-label","Modify Menu");
 
     //Add Edit
     var buttonContentview = document.createElement('button');
     buttonContentview.className = "btn btn-xs btn-success";
     buttonContentview.type = "button";
     buttonContentview.title = "Add/Edit/View Content for this item";
     buttonContentview.addEventListener("click",(e)=> { this.viewContent(item)} );      
     buttonContentview.append(viewIcon)
 
     //delete
     var buttonContentDelete = document.createElement('button');
     buttonContentDelete.className = "btn btn-xs btn-danger";
     buttonContentDelete.type = "button";
     buttonContentDelete.title = "Delete Content for this item";
     buttonContentDelete.addEventListener("click",(e)=> { this.deleteContent(item)} );
     if(item.isContentAvailable)
     buttonContentDelete.disabled = false;
     else
     buttonContentDelete.disabled = true;

     buttonContentDelete.append(deleteIcon)
     
     divContentBtnGroup.append(buttonContentview);
     divContentBtnGroup.append(buttonContentDelete);
 
    var span = document.createElement('span');
     span.className = "buttonGroupSpan";
     span.innerHTML = "Content";  

    var divMenuGroup = document.createElement('div');
    divMenuGroup.className = "contentButtonGroupDiv";
    divMenuGroup.append(span);
    divMenuGroup.append(divContentBtnGroup);
    
     return divMenuGroup;
  }

  navigateBackToMenu(){
    this.navigateToCourse("/admin/menu")
  }
  navigateToCourse(routeUrl){    
    this.router.navigate([routeUrl])
  }

  //content Group functions
  viewContent(item:CourseTilesModel){
    //take menuId and navigate to content
    //on content page show id, name and description of selected menu
    this.router.navigate(['/admin/content/'+ this.selectedMenuId +"/"+item.courseId ])
  }
  deleteContent(item){
    //show delete confirmations : id, name and description of selected menu
  }

  //button group functions
  addCourseTile(item:CourseTilesModel){
    //will add child course tile to current selected course Tile
    this.addUpdateOperation='Add';
    //this.courseTileFormGroup.controls['categories'].setValue("1", {onlySelf: true});
    this.courseTileFormGroup.patchValue({
      courseId : item.courseId,
      subCourseId: item.subCourseId,
      categories:'1'
    });

    this.openPopup();
  }
  editCourseTile(item:CourseTilesModel){
    //will edit child course tile to current selected course Tile

    this.addUpdateOperation='Update';
    this.courseTileFormGroup.patchValue({
      courseId : item.courseId,
      subCourseId: item.subCourseId,

      name : item.name,
      description: item.description,

      sequenceNumber: item.sequenceNumber,
      sortByDescending: item.sortByDescending,
      url: item.url,
      enabled:item.enabled,
      created: item.created,
      updated: item.updated,
      //categories: item.categoriesId
    });

    this.openPopup();
  }
  deleteCourseTile(item:CourseTilesModel){
    //delete selected course and its childs
    //first delete all childs then delete this   
    if(confirm("Proceed to delete this Item?")){
      this.courseTilesService.deleteCourseTiles(item.courseId)
      .subscribe((res:any)=>{
        if(res.isProcessed){
          this.getAllCourseTilesData();
        }        
        console.log(res);
      },
      (error)=>{
        console.log(error);
      })
    }
  }

  //modal popup
  displayStyle = "none";  
  addNewParentCourseTile(){
    this.addUpdateOperation='Add';
    this.courseTileFormGroup.patchValue({
      categories:'1'
    });
    this.openPopup();    
  }
  openPopup() {
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
    this.addUpdateOperation = '';
    this.courseTileFormGroup.reset()
  }

  //form
  addUpdateOperation:string='';
  onFormSubmit(){
    if(!this.courseTileFormGroup.valid){
      return;
    }
    
    console.log(this.courseTileFormGroup.value);
    let courseTile : CourseTilesModel = new  CourseTilesModel();
    courseTile.courseId = this.courseTileFormGroup.value.courseId? this.courseTileFormGroup.value.courseId :0;
    courseTile.name = this.courseTileFormGroup.value.name;
    courseTile.description = this.courseTileFormGroup.value.description;
    courseTile.menuId = this.selectedMenuId;

    //add record
    if(this.addUpdateOperation.toLowerCase() == 'add'){
      courseTile.subCourseId = this.courseTileFormGroup.value.courseId,
      this.courseTilesService.addCourseTiles(courseTile)
      .subscribe((res)=>{
        this.closePopup();
        this.getAllCourseTilesData();
        console.log(res);
      },
      (error)=>{
  
      })
    }

    //update record
    if(this.addUpdateOperation.toLowerCase() == 'update'){
      
      courseTile.subCourseId = this.courseTileFormGroup.value.subCourseId,
      courseTile.sequenceNumber = this.courseTileFormGroup.value.sequenceNumber ,
      courseTile.sortByDescending = this.courseTileFormGroup.value.sortByDescending,
      courseTile.url = this.courseTileFormGroup.value.url,
      courseTile.enabled = this.courseTileFormGroup.value.enabled,
      courseTile.created = this.courseTileFormGroup.value.created,
      courseTile.updated = this.courseTileFormGroup.value.updated,

      this.courseTilesService.updateCourseTiles(courseTile)
      .subscribe((res)=>{
        this.closePopup();
        this.getAllCourseTilesData();
        console.log(res);
      },
      (error)=>{
        console.log(error);
      })
    }    
  }

  showFormControlErrors(elementName:string){
    const elementError = this.courseTileFormGroup.get(elementName);
    if(elementError.touched && !elementError.valid){
      if(elementError.errors?.['required']){
        return this.capitalizeFirstLetter(elementName) + ' Required.';
      }
      if(elementError.errors?.['minlength']){
        const requiredLength = elementError.errors?.['minlength']?.requiredLength;
        return this.capitalizeFirstLetter(elementName) 
        + ' length must be minimum '
        + requiredLength+' characters.';
      }
    }
    return '';
  }
  capitalizeFirstLetter(elementName) {
    return elementName.charAt(0).toUpperCase() + elementName.slice(1);
  }
}
