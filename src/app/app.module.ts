import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthModule, AuthGuard } from '@auth0/auth0-angular';

import { ProductListComponent } from './components/product-list/product-list.component';
import {HttpClientModule} from '@angular/common/http';
import { ProductService } from './services/product.service';

import {Routes, RouterModule} from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckOutComponent } from './components/check-out/check-out.component';
import { CartService } from './services/cart.service';
import { LoginComponent } from './components/login/login.component';
import { AuthStatusComponent } from './components/auth-status/auth-status.component';

// Import the injector module and the HTTP client module from Angular
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// Import the HTTP interceptor from the Auth0 Angular SDK
import { AuthHttpInterceptor } from '@auth0/auth0-angular';


import {
  OktaAuthGuard,
  OktaAuthModule,
  OktaCallbackComponent,
  OKTA_CONFIG
} from '@okta/okta-angular';

import  {OktaAuth} from '@okta/okta-auth-js';
import myAppConfig from './config/my-app-config';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';

const authModuleConfig = {
  // The domain and clientId were configured in the previous chapter
  domain: 'openmarket.us.auth0.com',
  clientId: 'ghNyYJ7hXX9yuZoSU1vy6flmlDBH4GJz',
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: "https://openmarket.us.auth0.com/api/v2/",
    scope: "read:current_user update:current_user_metadata"
  },
};

const routes: Routes = [
  {path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard]},
  {path: 'members', component: MembersPageComponent, canActivate: [AuthGuard]},
  {path: 'login/callback', component: OktaCallbackComponent},
  {path: 'login', component: LoginComponent},
  {path:'checkout', component: CheckOutComponent, canActivate: [AuthGuard]},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'category/:id', component: ProductListComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'products', component: ProductListComponent},
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: '**', redirectTo: '/products', pathMatch: 'full'}
]

const oktaConfig = myAppConfig.oidc;
const oktaAuth = new OktaAuth(oktaConfig);

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckOutComponent,
    LoginComponent,
    AuthStatusComponent,
    MembersPageComponent,
    OrderHistoryComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    OktaAuthModule,
    AuthModule.forRoot(authModuleConfig)
  ],
  providers: [
    ProductService,
    CartService,
    {provide: OKTA_CONFIG, useValue: {oktaAuth}},
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }


// openmarket.us.auth0.com

