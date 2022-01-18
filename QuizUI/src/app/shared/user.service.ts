import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser : any;
  constructor(private fb: FormBuilder, private http: HttpClient ) { }
  formModel = this.fb.group({
    UserName: ['', Validators.required],
    Email: ['', Validators.email],
    FullName: [''],
    Passwords: this.fb.group({
      Password: ['', [Validators.required, Validators.minLength(4) , Validators.maxLength(40)]],
      ConfirmPassword: ['', Validators.required]
    }, { validator: this.comparePasswords })

  });

  comparePasswords(fb: FormGroup) {
    let confirmPswrdCtrl = fb.get('ConfirmPassword');
    //passwordMismatch
    //confirmPswrdCtrl.errors={passwordMismatch:true}
    if (confirmPswrdCtrl!.errors == null || 'passwordMismatch' in confirmPswrdCtrl!.errors) {
      if (fb.get('Password')!.value != confirmPswrdCtrl!.value)
        confirmPswrdCtrl!.setErrors({ passwordMismatch: true });
      else
        confirmPswrdCtrl!.setErrors(null);
    }
  }
  register(form : any) {
    var body = {
      UserName: form.username,
      Email: form.email,
      FullName: form.fullname,
      Password: form.password
    };
    return this.http.post(environment.BaseURI + '/ApplicationUser/Register', body);
  }
  
  login(formData: any) {
    return this.http.post(environment.BaseURI + '/ApplicationUser/Login', formData);
  }
  getUserProfile() {
    var tokenHeader = new HttpHeaders({'Authorization':'Bearer' + localStorage.getItem('token')})
    return this.http.get(environment.BaseURI + '/UserProfile',{headers: tokenHeader});
  }

  roleMatch(allowedRoles : any): boolean {
    var isMatch = false;
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token')!.split('.')[1]));
    var userRole = payLoad.role;
    // allowedRoles.forEach((element: any) => {
    //   if (userRole == element) {
    //     isMatch = true;
    //     return false;
    //   }
    // });
    return isMatch;
  }

  getUser(): any{
    this.currentUser = this.getDataFromToken(localStorage.getItem('token'))
  }
  

  // public GetToken(): any {
  //   return this.storageService.retrieve('user_token');
  // }
  private getDataFromToken(token: any) {
    let data = {};
    if (typeof token !== 'undefined') {
        const encoded = token.split('.')[1];
        data = JSON.parse(this.urlBase64Decode(encoded));
    }
    return data;
  }

  
  private urlBase64Decode(str: string) {
    let output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
        case 0:
            break;
        case 2:
            output += '==';
            break;
        case 3:
            output += '=';
            break;
        default:
            throw 'Illegal base64url string!';
    }

    return window.atob(output);
}
  


}
