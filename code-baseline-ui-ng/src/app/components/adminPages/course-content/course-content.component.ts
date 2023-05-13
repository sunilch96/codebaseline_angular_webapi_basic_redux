import { AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription, tap } from 'rxjs';
import { CourseTilesModel } from 'src/app/models/courseTilesModel';
import { MenuSubMenuModel } from 'src/app/models/menuSubMenuModel';
import { ContentService } from 'src/app/services/content.service';
import { CourseTilesService } from 'src/app/services/courseTiles.service';
import { MenuSubMenuService } from 'src/app/services/menuSubMenu.service';
import { AppState } from 'src/app/store/app.state';
import { ContentModel } from "../../../models/content.model";
import { SetLoadingSpinnerAction } from '../../shared/state/shared.actions';
@Component({
  selector: 'app-course-content',
  templateUrl: './course-content.component.html',
  styleUrls: ['./course-content.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CourseContentComponent implements OnInit, OnDestroy {
  constructor(private store: Store<AppState>,
    private contentService : ContentService,
    private courseTilesService: CourseTilesService,
    private currentRoute : ActivatedRoute,
    private router:Router){}

  ngOnInit(): void {debugger;
    this.menuId = this.currentRoute.snapshot.params['menuId'];
    this.courseId = this.currentRoute.snapshot.params['courseId'];
    this.getContent(this.menuId,this.courseId);
    this.getCourseTitleAndMenuData();
    this.contentForm = new FormGroup({
      'contentEditor': new FormControl(null)
    });

    this.contentImageFormGroup = new FormGroup({      
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
      sequenctNumber: new FormControl(null),
      sortByDescending: new FormControl(),
      url: new FormControl(null),
      enabled: new FormControl(true),
      created: new FormControl(true),
      updated: new FormControl(true)
    });
  }

  ngOnDestroy(): void {
    if(this.postCounterSubscription){
      this.postCounterSubscription.unsubscribe();
    }
  }

  menuId:number;
  courseId:number;
  menuSubMenu$ : Observable<MenuSubMenuModel>;
  menuCourseTiles : MenuSubMenuModel;
  courseContentData : ContentModel;
  contentForm:FormGroup;
  postCounterSubscription: Subscription

  EditorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
  
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
  
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
  
      ['clean'],                                         // remove formatting button
  
      ['link', 'image', 'video']                         // link and image, video
    ]
  };

  getCourseTitleAndMenuData(){
    if(this.courseId == 0 || !this.courseId){
      return;
    }
      this.courseTilesService.getCourseTileByMenuIdAndCourseId(this.menuId, this.courseId)
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
    
    this.contentService.getContentById(menuId, courseId)
    .pipe(tap(x=>{
      this.store.dispatch(SetLoadingSpinnerAction({status:true}))
    }))
    .subscribe((data)=>{
      this.courseContentData = data
      if(this.courseContentData?.htmlContent){
        this.contentForm.patchValue({
          contentEditor:this.courseContentData?.htmlContent
        });
        this.editorCurrentLength = this.courseContentData?.htmlContent.length;
      }
    },
    (error)=>{
      this.store.dispatch(SetLoadingSpinnerAction({status:false}))
    },
    ()=>{
      this.store.dispatch(SetLoadingSpinnerAction({status:false}))
    })
  }
  onEditorTextAreaChange(e){
    if(e.target?.value){
      //update content
      this.courseContentData.htmlContent = e.target.value
      this.contentForm.patchValue({
        contentEditor:this.courseContentData?.htmlContent
      });
      this.editorCurrentLength = this.courseContentData?.htmlContent.length;
    }
  }
  onContentFormSubmit(){
    if(!this.contentForm.get('contentEditor').value){
      return;
    }

    var content: ContentModel = new ContentModel;
    content.courseId = this.menuCourseTiles.courseTile.courseId;
    content.menuId = this.menuCourseTiles.menuId;
    content.htmlContent = this.contentForm.get('contentEditor').value;
    
    this.postCounterSubscription = this.contentService
    .addContent(content)
    .pipe(tap(x=>{
      this.store.dispatch(SetLoadingSpinnerAction({status:true}))
    }))
    .subscribe({
      next: (data)=>{
        this.store.dispatch(SetLoadingSpinnerAction({status:false}))
      },
      error: (error)=>{
        console.log(error)
        this.store.dispatch(SetLoadingSpinnerAction({status:false}))
      }
    });
  }

  maxEditorLength = 10000;
  contentErrorMessage:string = null;
  editorCurrentLength:number = 0;  
  maxLength(e){
    this.editorCurrentLength = e.html.length;
    if(this.editorCurrentLength >= this.maxEditorLength){
      //e.editor.deleteText(e.editor.getLength(), e.editor.getLength());
      this.contentErrorMessage = `Warning : Editor limit of ${this.maxEditorLength} (${this.maxEditorLength/1000}K) characters reached. Please remove extra contents.`;            
    }
    else{
      this.contentErrorMessage = null;
    }
  }

  //content Image part
  contentImageFormGroup: FormGroup;
  addUpdateOperation:string='';
  timeOutInterval:any;
  setClipboardTextTimeOut(elementId){
    if(document.getElementById(elementId)){
      document.getElementById(elementId).hidden = false
    }
    
    this.timeOutInterval = setTimeout(() => {
      if(document.getElementById(elementId)){
        document.getElementById(elementId).hidden = true;
      }
  }, 2000);
  }

  addContentImage(){
    this.addUpdateOperation = 'Add';
    this.openPopup();
  }
  editContentImage(data){
    this.addUpdateOperation = 'Update';
    this.openPopup();
  }
  deleteContentImage(data){
    if(confirm("Proceed to delete this Item?")){
    }
  }
  copyImageUrlToClipboard(imgUrl, elementId){
    this.setClipboardTextTimeOut(elementId);
  }

  //modal form
  displayStyle = "none";  
  openPopup() {
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
    this.addUpdateOperation = '';
    this.contentImageFormGroup.reset()
  }
  
  navigateBackToCourse(){
    this.navigateToPage("/admin/coursetiles/" + this.menuId);
    
  }

  navigateToPage(routeUrl){
    this.router.navigate([routeUrl]);
  }
  onContentImageFormSubmit(){
    if(!this.contentImageFormGroup.valid){
      return;
    }
  }
  
  showFormControlErrors(elementName){
    const elementError = this.contentImageFormGroup.get(elementName);
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
