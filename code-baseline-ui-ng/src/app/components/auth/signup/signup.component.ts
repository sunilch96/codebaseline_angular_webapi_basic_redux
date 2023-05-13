import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { SetLoadingSpinnerAction } from '../../shared/state/shared.actions';
import { SignUpStartAction } from '../state/auth.action';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
  constructor(private store: Store<AppState>){}
  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      userName : new FormControl('test@test.com',[
        Validators.required,
        Validators.minLength(5)
      ]),
      email: new FormControl('test@test.com',[
        Validators.required,
        Validators.email,
        Validators.minLength(5)
      ]),
      password: new FormControl('Admin@123',[
        Validators.required,
        Validators.minLength(5)
      ]),
      confirmPassword: new FormControl('Admin@123',[
        Validators.required,
        Validators.minLength(5)
      ])
    })
  }
  
  signUpForm : FormGroup;

  onFormSubmit(){
    if(!this.signUpForm.valid){
      return;
    }

    this.store.dispatch(SetLoadingSpinnerAction({status:true}));

    this.store.dispatch(SignUpStartAction({
      userName: this.signUpForm.value.userName,
      email:this.signUpForm.value.email,
      password: this.signUpForm.value.password
    }));
  }

  showFormControlErrors(elementName){
    const elementError = this.signUpForm.get(elementName);
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
