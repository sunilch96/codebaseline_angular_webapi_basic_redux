import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription, tap } from 'rxjs';
import { CategoryModel } from 'src/app/models/categoryModel';
import { MenuSubMenuModel } from 'src/app/models/menuSubMenuModel';
import { MenuSubMenuService } from 'src/app/services/menuSubMenu.service';
import { AppState } from 'src/app/store/app.state';
import { SetLoadingSpinnerAction } from '../../shared/state/shared.actions';
import { getCategoriesStateSelector } from '../state/admin.selector';

@Component({
  selector: 'app-menu-master',
  templateUrl: './menu-master.component.html',
  styleUrls: ['./menu-master.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenuMasterComponent implements OnInit, OnDestroy{
  constructor(private menuService: MenuSubMenuService, 
    private router:Router,
    private storeService: Store<AppState>){}
    
  categoriesList$ : Observable<CategoryModel[]>;  
  categoriesSubscription : Subscription;

  ngOnInit(): void {
    this.categoriesList$ = this.storeService.select(getCategoriesStateSelector);
    this.getAllMenuSubMenuData();

    this.menuFormGroup = new FormGroup({      
      name: new FormControl(null,[
        Validators.required,
        Validators.minLength(5)
      ]),
      description: new FormControl(null,[
        Validators.required,
        Validators.minLength(5)
      ]),
      categories: new FormControl('-1'), // default value
      menuId: new FormControl(null),
      subMenuId: new FormControl(null),
      sequenceNumber: new FormControl(null),
      sortByDescending: new FormControl(),
      url: new FormControl(null),
      enabled: new FormControl(true),
      created: new FormControl(true),
      updated: new FormControl(true)
    });
        
    //this.menuFormGroup.controls['Categories'].setValue("-1", {onlySelf: true});
  }

  ngOnDestroy(): void {
    if(this.menuSubMenuSubscription){
      this.menuSubMenuSubscription.unsubscribe();
    }
    if(this.categoriesSubscription){
      this.categoriesSubscription.unsubscribe();
    }
  }
  
  menuFormGroup: FormGroup;
  menuSubMenuSubscription : Subscription;
  
  getAllMenuSubMenuData(){
    
    this.menuService.getMenuSubMenu()
    .pipe(tap(x=>{
      this.storeService.dispatch(SetLoadingSpinnerAction({status:true}))
    }))
    .subscribe((data)=>{
      this.getMenuChildMenu(data);
      this.toggleMenus();
      this.expandCollapseMenu();
    },
    (e)=>{
      this.storeService.dispatch(SetLoadingSpinnerAction({status:false}));
    },
    ()=>{
      this.storeService.dispatch(SetLoadingSpinnerAction({status:false}));
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

  getMenuChildMenu(data:MenuSubMenuModel[]){
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

                  if(currentItem.category)
                  small_i.innerHTML = "(" + currentItem.category.categoryName +")";

                  span_small.append(small_i);
                div1_span.append(span_small);
                
                div1_div.append(div1_span);
                div1_div.append(this.buttonGroup(currentItem, '', true));

            div1.append(div1_div);

            div1.append(div2);
      
      if(currentItem.childSubMenuModels){
         //first UL
        var firstUl = document.createElement("ul");
        firstUl.className = "menuUL list-group";
        var firstLI = document.createElement("li");
        firstLI.className = "menuUL list-group";
          
        var liCaret = document.createElement("span");
          liCaret.className = "caret";
          liCaret.innerHTML = currentItem.name;
          liCaret.id = "caret_" + currentItem.menuId;
          liCaret.setAttribute("collapsemenu", "collapsemenu_" + currentItem.menuId);
          liCaret.setAttribute("parent", "parent");
          
          var span = document.createElement("span");
            span.className = "courseCount ms-3 badge bg-primary rounded-pill";
            span.innerHTML = String(currentItem.childSubMenuModels.length);
            liCaret.append(span);

          firstLI.append(liCaret);        
        firstUl.append(firstLI);

        this.addChildMenus(firstLI, currentItem, currentItem.childSubMenuModels);
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
    var courseMenuSubMenu = document.getElementById("courseMenuSubMenu");
      while (courseMenuSubMenu?.firstChild) {
        courseMenuSubMenu.firstChild.remove()
      }
    courseMenuSubMenu.append(ul);   
  }

  addChildMenus(element, currentItem, data:MenuSubMenuModel[]){
    var ul = document.createElement("ul");
    ul.className = "nested list-group";
    var count = 0;
    for(let item of data){
      count++;
      var li = document.createElement("li");
      li.className = "list-group-item";      
      if(item.childSubMenuModels){
        var spanCaret = document.createElement("span");
        spanCaret.className = "caret";
        spanCaret.innerHTML = item.name;
        spanCaret.id = "caret_" + item.menuId;
        spanCaret.setAttribute("collapsemenu", "collapsemenu_" + currentItem.menuId);
        li.append(spanCaret);

        var span = document.createElement("span");
        span.className = "ms-3 badge bg-primary rounded-pill";
        span.innerHTML = String(item.childSubMenuModels.length);

        li.append(span);
        //pass css: buttonsForMenuWitChild
        li.append(this.buttonGroup(item, 'buttonsForMenuWitChild',false));
        this.addChildMenus(li, item, item.childSubMenuModels);
        ul.append(li)
        
      }
      else{
        if(count % 2 ==0){
          li.className = "backGroundColourOnHover list-group-item list-group-item-secondary";
        }
        else{
          li.className = "backGroundColourOnHover list-group-item";
        }
        li.append(this.buttonsForMenuWithoutChild(item))
        ul.append(li);
      }
    }

   //apped New UL to first LI
   element.append(ul);
  }

  buttonsForMenuWithoutChild(item:MenuSubMenuModel){
    var div = document.createElement('div');
    div.className = "displaySpaceBetween";

    var span = document.createElement('span');
    span.innerHTML = item.name;
    span.className = "menuNameCenter";

    div.append(span);
    div.append(this.buttonGroup(item));
    return div;
  }
  
  buttonGroup(item:MenuSubMenuModel, cssClass = '', isCalledFromFirstMenu = false){

    //Menu Buttons
    var divMenuBtnGroup = document.createElement('div');
    divMenuBtnGroup.className = "btn-group btn-group-sm " + cssClass;
    divMenuBtnGroup.setAttribute("role","group");
    divMenuBtnGroup.setAttribute("aria-label","Modify Menu");

    var buttonAdd = document.createElement('button');
    buttonAdd.className = "btn btn-xs btn-primary";
    buttonAdd.type = "button";
    buttonAdd.title = "Add Child Menu";
    buttonAdd.addEventListener("click",(e)=> { this.addMenuSubMenu(item)} );
      var addIcon = document.createElement('i');
      addIcon.className = "bi bi-plus-circle";
      buttonAdd.append(addIcon)
    
    var buttonEdit = document.createElement('button');
    buttonEdit.className = "btn btn-xs btn-warning";
    buttonEdit.type = "button";
    buttonEdit.title = "Edit this menu";
    buttonEdit.addEventListener("click",(e)=> { this.editMenuSubMenu(item)} );
      var editIcon = document.createElement('i');
      editIcon.className = "bi bi-pencil-square";
      buttonEdit.append(editIcon)

    var buttonDelete = document.createElement('button');
    buttonDelete.className = "btn btn-xs btn-danger";
    buttonDelete.type = "button";
    buttonDelete.title = "Delete this menu";
    buttonDelete.addEventListener("click",(e)=> { this.deleteMenuSubMenu(item)} );
    var deleteIcon = document.createElement('i');
      deleteIcon.className = "bi bi-trash3";
      buttonDelete.append(deleteIcon)
    
      divMenuBtnGroup.append(buttonAdd);
      divMenuBtnGroup.append(buttonEdit);
      divMenuBtnGroup.append(buttonDelete);

    var span = document.createElement('span');
    span.className = "buttonGroupSpan";
    span.innerHTML = "Menu-SubMenu";    

    var divMenuGroup = document.createElement('div');
    divMenuGroup.className = "buttonGroupDiv";
    divMenuGroup.append(span);
    divMenuGroup.append(divMenuBtnGroup);
    
    //Combine Button Groups
    var divCombinedGroup = document.createElement('div');    
    if(item.childSubMenuModels && !isCalledFromFirstMenu){
      divCombinedGroup.className = "backGroundColourOnHover divCombinedGroup divMenuHavingChildren";
    }
    else{
      divCombinedGroup.className = "backGroundColourOnHover divCombinedGroup";
    }

    divCombinedGroup.append(divMenuGroup);

    if(!item.childSubMenuModels){
      divCombinedGroup.append(this.contentButtonGroup(item, cssClass));    
    }
    return divCombinedGroup;
  }

  contentButtonGroup(item:MenuSubMenuModel, cssClass = ''){
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
 
     var buttonContentview = document.createElement('button');
     buttonContentview.className = "btn btn-xs btn-success";
     buttonContentview.type = "button";
     buttonContentview.title = "Add/Edit/View Content for this item";
     buttonContentview.addEventListener("click",(e)=> { this.viewContent(item)} );      
     buttonContentview.append(viewIcon)
 
     var buttonContentDelete = document.createElement('button');
     buttonContentDelete.className = "btn btn-xs btn-danger";
     buttonContentDelete.type = "button";
     buttonContentDelete.title = "Delete Content for this item";
     buttonContentDelete.addEventListener("click",(e)=> { this.deleteContent(item)} );  
     buttonContentDelete.append(deleteIcon)
     
     divContentBtnGroup.append(buttonContentview);
     divContentBtnGroup.append(buttonContentDelete);
 
    var span = document.createElement('span');
     span.className = "buttonGroupSpan";
     span.innerHTML = "Course Tiles";  

    var divMenuGroup = document.createElement('div');
    divMenuGroup.className = "contentButtonGroupDiv";
    divMenuGroup.append(span);
    divMenuGroup.append(divContentBtnGroup);
    
     return divMenuGroup;
  }

  navigateToCourse(routeUrl){    
    this.router.navigate([routeUrl])
  }

  //content Group functions
  viewContent(item:MenuSubMenuModel){
    //take menuId and navigate to content
    //on content page show id, name and description of selected menu
    this.router.navigate(['/admin/coursetiles/'+ item.menuId ])
  }
  deleteContent(item){
    //show delete confirmations : id, name and description of selected menu
  }

  //button group functions
  addMenuSubMenu(item:MenuSubMenuModel){
    //will add child course tile to current selected course Tile
    this.addUpdateOperation='Add';
    //this.menuFormGroup.controls['categories'].setValue("1", {onlySelf: true});
    this.menuFormGroup.patchValue({
      menuId : item.menuId,
      mubMenuId: item.subMenuId,
      categories:'1'
    });

    this.openPopup();
  }
  editMenuSubMenu(item:MenuSubMenuModel){
    //will edit child course tile to current selected course Tile

    this.addUpdateOperation='Update';
    this.menuFormGroup.patchValue({
      menuId : item.menuId,
      subMenuId: item.subMenuId,

      name : item.name,
      description: item.description,

      sequenceNumber: item.sequenceNumber,
      sortByDescending: item.sortByDescending,
      url: item.url,
      enabled:item.enabled,
      created: item.created,
      updated: item.updated,
      categories: item.categoriesId
    });

    this.openPopup();
  }
  deleteMenuSubMenu(item:MenuSubMenuModel){
    //delete selected course and its childs
    //first delete all childs then delete this
    if(confirm("Proceed to delete this Item?")){
      this.menuService.deleteMenuSubMenu(item.menuId)
      .subscribe((res:any)=>{
        if(res.isProcessed){
          this.getAllMenuSubMenuData();
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
  addNewParentMenu(){
    this.addUpdateOperation='Add';
    this.menuFormGroup.patchValue({
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
    this.menuFormGroup.reset()
  }

  //form
  addUpdateOperation:string='';
  onFormSubmit(){
    if(!this.menuFormGroup.valid){
      return;
    }
    
    console.log(this.menuFormGroup.value);
    let postData : MenuSubMenuModel = new  MenuSubMenuModel();
    postData.menuId = this.menuFormGroup.value.menuId? this.menuFormGroup.value.menuId :0;
    postData.name = this.menuFormGroup.value.name;
    postData.description = this.menuFormGroup.value.description;
    postData.categoriesId = this.menuFormGroup.value.category? parseInt(this.menuFormGroup.value.category) :0;
 
    //add record
    if(this.addUpdateOperation.toLowerCase() == 'add'){
      postData.subMenuId = this.menuFormGroup.value.menuId,
      this.menuService.addMenuSubMenu(postData)
      .subscribe((res)=>{
        this.closePopup();
        this.getAllMenuSubMenuData();
        console.log(res);
      },
      (error)=>{
  
      })
    }

    //update record
    if(this.addUpdateOperation.toLowerCase() == 'update'){
      
      postData.subMenuId = this.menuFormGroup.value.subMenuId,
      postData.sequenceNumber = this.menuFormGroup.value.sequenceNumber ,
      postData.sortByDescending = this.menuFormGroup.value.sortByDescending,
      postData.url = this.menuFormGroup.value.url,
      postData.enabled = this.menuFormGroup.value.enabled,
      postData.created = this.menuFormGroup.value.created,
      postData.updated = this.menuFormGroup.value.updated,

      this.menuService.updateMenuSubMenu(postData)
      .subscribe((res)=>{
        this.closePopup();
        this.getAllMenuSubMenuData();
        console.log(res);
      },
      (error)=>{
        console.log(error);
      })
    }    
  }

  showFormControlErrors(elementName:string){
    const elementError = this.menuFormGroup.get(elementName);
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
