import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fb: FormBuilder, private http: HttpClient) { }
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
    return this.http.get(environment.BaseURI + '/UserProfile');
  }


}
