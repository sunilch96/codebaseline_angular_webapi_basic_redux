import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { SetLoadingSpinnerAction } from '../../shared/state/shared.actions';
import { LoginStartAction } from '../state/auth.action';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
constructor(private store: Store<AppState>, private location: Location){}
ngOnInit(): void {
  //this.registerUserName =  this.location.getState().userName;
  this.loginForm = new FormGroup({
    email: new FormControl('test@test.com',[
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('Admin@123',[
      Validators.required,
      Validators.minLength(5)
    ])
  });
}

registerUserName:string = ''
loginForm: FormGroup;
onLoginSubmit(){
  if(!this.loginForm.valid){
    return;
  }
  //show spinner, hide spinner in auth effect
  this.store.dispatch(SetLoadingSpinnerAction({status:true}));
  //call login api 
  const email = this.loginForm.value.email;
  const password = this.loginForm.value.password;
  this.store.dispatch(LoginStartAction({email, password}))
}

showFormControlErrors(elementName){
  const elementError = this.loginForm.get(elementName);
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

    if(elementError.errors?.['email']){
      return 'Invalid Email';
    }
  }
  return '';
}
capitalizeFirstLetter(elementName) {
  return elementName.charAt(0).toUpperCase() + elementName.slice(1);
}
}
