import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { EntityDataModule } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthEffects } from './components/auth/state/auth.effects';
import { HeaderComponent } from './components/common/header/header.component';
import { LoadingSpinnerComponent } from './components/shared/loading-spinner/loading-spinner.component';
import { HomeComponent } from './components/userPages/home/home.component';
import { AuthTokenInterceptor } from './services/authToken.interceptor';
import { AppStateReducer } from './store/app.state';
import { CustomRouterStateSerialize } from './store/router/custom-router-store-serializer';
import { FooterComponent } from './components/common/footer/footer.component';
import { MenubarComponent } from './components/userPages/menubar/menubar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,       
    HeaderComponent,
    LoadingSpinnerComponent,
    FooterComponent,        
  ],
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,    
    FormsModule,
    ReactiveFormsModule,   
    AppRoutingModule,
    HttpClientModule,
    EffectsModule.forRoot([AuthEffects]),
    StoreModule.forRoot(AppStateReducer),
    EntityDataModule, // entity data : @ngrx/data
    StoreDevtoolsModule.instrument({
      //maxAge:250, // 25 states or actions to capture
      //logOnly: environment .production
    }),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomRouterStateSerialize
    })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass : AuthTokenInterceptor,
    multi : true
  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
