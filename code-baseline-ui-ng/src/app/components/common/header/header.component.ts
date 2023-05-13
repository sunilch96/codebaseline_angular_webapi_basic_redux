import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LogOutUserAction } from '../../auth/state/auth.action';
import { getIsAuthenticatedStateSelector } from '../../auth/state/auth.selector';
import { AuthState } from '../../auth/state/auth.state';
import { SetLoadingSpinnerAction } from '../../shared/state/shared.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  constructor(private store: Store<AuthState>){}
  ngOnInit(): void {
    this.isAuthenticated$ = this.store.select(getIsAuthenticatedStateSelector);
  }
  isAuthenticated$: Observable<boolean>;
  onLogOutCLick(event:Event){
    event.preventDefault();
    //show spinner, hide spinner in auth effect
    this.store.dispatch(SetLoadingSpinnerAction({status:true}));
    this.store.dispatch(LogOutUserAction());
  }
}
