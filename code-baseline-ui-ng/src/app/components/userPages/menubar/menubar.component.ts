import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MenuSubMenuModel } from 'src/app/models/menuSubMenuModel';
import { MenuSubMenuService } from 'src/app/services/menuSubMenu.service';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MenubarComponent implements OnInit, OnDestroy{
  constructor(private menuService: MenuSubMenuService, private router:Router){}
  ngOnInit(): void {
    this.menuServiceSubscription = this.menuService.getMenuSubMenu().subscribe((data)=>{      
      this.getMenuChildMenu(data); 
    });
  };
  ngOnDestroy(): void {
    if(this.menuServiceSubscription){
      this.menuServiceSubscription.unsubscribe();
    }
  }

  showHideMenu: boolean = true;
  courseMenuSubMenu:MenuSubMenuModel[];
  navMenuList : object;
  menuServiceSubscription : Subscription;

  toggleShowHideMenu(){
    this.showHideMenu = !this.showHideMenu;
  }

  @ViewChild('courseMenuSubMenu') courseMenuSubMenuElement:ElementRef;
  
  getMenuChildMenu(data){
    var ul = document.createElement("ul");
    ul.className = "navbar-nav";    

    for (let i = 0; i < data.length ; i++) {
      var currentItem = data[i];
      var courseMenuSubMenu = document.getElementById("courseMenuSubMenu");
      if(currentItem.childSubMenuModels){
        this.addChildMenus(courseMenuSubMenu, currentItem, currentItem.childSubMenuModels);
      }
      else{
        var a = document.createElement("a");
        a.className = "dropdown-item menuWithoutSubMenu";
        a.addEventListener("click",(e)=> { this.navigateToCourse(`course/${currentItem.menuId}`)} );
        a.innerHTML = currentItem.name;
        courseMenuSubMenu.append(a);
      }      
    }    
  }

  addChildMenus(menuDiv, currentItem, childSubMenuModels){
    //first Drop Down
    var dropdownDiv = document.createElement('div');
      dropdownDiv.className = "dropdown";
      var dropdownButton = document.createElement('button');
        dropdownButton.className = "btn btn-default dropdown-toggle";
        dropdownButton.type = "button";
        dropdownButton.setAttribute("data-toggle","dropdown");

        dropdownButton.innerHTML = currentItem.name;
        var spanCaret = document.createElement('span');
          spanCaret.className = "caret";
          dropdownButton.append(spanCaret);

      dropdownDiv.append(dropdownButton);
     
      if(currentItem.childSubMenuModels)
      {
        this.addSubMenus(dropdownDiv,currentItem.childSubMenuModels);
      }
      
      menuDiv.append(dropdownDiv);
  }

  addSubMenus(element, childSubMenuClassData){
    
    var ul = document.createElement('ul');
    ul.className = "dropdown-menu elementOnTop";
    for(let items of childSubMenuClassData){      
      var li = document.createElement('li');         

      //recursive
      if(items.childSubMenuModels)
      {
        //add divider if li element is there      
        if(ul.childNodes.length > 0){
          var _dividerLi = document.createElement('li');
          var _dividerHr = document.createElement('hr');
          _dividerHr.className = "dropdown-divider";
          _dividerLi.append(_dividerHr);
          ul.append(_dividerLi);
        }       
        this.addChildSubMenus(ul, items.childSubMenuModels, items.name)
      }
      else{
        li.className = "nav-link";
        var a = document.createElement('a');
        a.className = "dropdown-item";
        a.setAttribute("tabindex","-1");
        a.addEventListener("click",(e)=> { this.navigateToCourse(`course/${items.menuId}`)} );
        a.innerHTML = items.name;
        li.append(a);
        
        ul.append(li);
      }
    }
    element.append(ul); 
  }

  addChildSubMenus(ul, data, menuName){
    var _ul = document.createElement('ul');
    _ul.className = "dropdown-menu elementOnTop";

    for(let item of data){
      var _li = document.createElement('li');
        if(item.childSubMenuModels){
          this.addChildSubMenus(_li, item.childSubMenuModels, item.name);
        }
        else{
          var _a = document.createElement('a');
          _a.className = "dropdown-item";
          _a.setAttribute("tabindex","-1");
          _a.addEventListener("click",(e)=> { this.navigateToCourse(`course/${item.menuId}`)} );
          _a.innerHTML = item.name;
          _li.append(_a);
        }
        
      _ul.append(_li);
    }

    var li = document.createElement('li');
    li.className = "dropdown-submenu";
    var a = document.createElement('a');
    a.className = "dropdown-item";
    a.setAttribute("tabindex","-1");
    a.href="#";
    a.innerHTML = menuName;
    var span = document.createElement('span');
    span.className = "caret";
    a.append(span);

    li.append(a);

    li.append(_ul);
    ul.append(li);
  }

  navigateToCourse(routeUrl){    
    this.router.navigate([routeUrl])
  }
}
