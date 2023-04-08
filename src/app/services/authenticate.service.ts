import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  authServerUrl = environment.authServerUrl;
  accessToken: string = '';
  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  getAccessToken() {
    return this.authService.getAccessTokenSilently()
  }

  getUserId() {
    return this.authService.user$
  }

  getUserInfo(userId: string, token: string) {
    let userUrl = environment.authServerUrl + userId;
    return this.http.get(userUrl, {
      headers: { Authorization: 'Bearer ' + token }
    })
  }
}
