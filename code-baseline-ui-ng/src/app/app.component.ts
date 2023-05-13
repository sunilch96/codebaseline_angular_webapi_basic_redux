import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AutoLoginAction } from './components/auth/state/auth.action';
import { getErrorStateSelector, getLoadingStateSelector } from './components/shared/state/shared.selector';
import { AppState } from './store/app.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(private store : Store<AppState>){}
  ngOnInit(): void {
    this.showLoading$ = this.store.select(getLoadingStateSelector);
    this.errorMsg$ = this.store.select(getErrorStateSelector);
    this.store.dispatch(AutoLoginAction());
  }

  title = 'ngrxTutorial';
  showLoading$ : Observable<boolean>;
  errorMsg$:Observable<string>;
}
