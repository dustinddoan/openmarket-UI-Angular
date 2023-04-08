import { Component, Inject } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import {OktaAuth} from '@okta/okta-auth-js';
import OktaSignIn from '@okta/okta-signin-widget';

import myAppConfig from 'src/app/config/my-app-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  oktaSignin: any;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth){
    this.oktaSignin = new OktaSignIn({
      logo: 'assets/okta-logo.svg',
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      authParams: {
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      }
    })
  }

  ngOnInit(){
    this.oktaSignin.remove();

    this.oktaSignin.renderEl(
      {el: '#okta-sign-in-widget'},
      (response: any) => {
        if (response.status === 'SUCCESS') {
          this.oktaAuth.signInWithRedirect
        }
      },
      (error: any) => {
        throw error;
      }
    );
  }
}
