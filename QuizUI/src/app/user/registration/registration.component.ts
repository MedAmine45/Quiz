import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/shared/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  form: FormGroup;
  submitted = false;

  constructor(public service: UserService , private toastr: ToastrService  , private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.form = this.formBuilder.group(
      {
        fullname: ['', Validators.required],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20)
          ]
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40)
          ]
        ],
        confirmPassword: ['', Validators.required],
        acceptTerms: [false, Validators.requiredTrue]
      },
      {
        validators: [Validation.match('password', 'confirmPassword')]
      }
    );
  }
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


  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    console.log(this.form.value);
    this.service.register(this.form.value).subscribe(
      (res: any) => {
        if (res.succeeded) {
          this.onReset()
          this.toastr.success('Nouvel utilisateur créé !', 'Enregistrement réussi.');
        } else {
          res.errors.forEach((element : any) => {
            switch (element.code) {
              case 'DuplicateUserName':
                this.toastr.error('Le nom d\'utilisateur est déjà pris','L\'enregistrement a échoué.');
                break;

              default:
              this.toastr.error(element.description,'Échec de l\'enregistrement.');
                break;
            }
          });
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }



  // onSubmit() {
  //   this.service.register().subscribe(
  //     (res: any) => {
  //       if (res.succeeded) {
  //         this.service.formModel.reset();
  //         this.toastr.success('New user created!', 'Registration successful.');
  //       } else {
  //         res.errors.forEach((element : any) => {
  //           switch (element.code) {
  //             case 'DuplicateUserName':
  //               this.toastr.error('Username is already taken','Registration failed.');
  //               break;

  //             default:
  //             this.toastr.error(element.description,'Registration failed.');
  //               break;
  //           }
  //         });
  //       }
  //     },
  //     err => {
  //       console.log(err);
  //     }
  //   );
  // }

}

export default class Validation {
  static match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (checkControl?.errors && !checkControl.errors.matching) {
        return null;
      }

      if (control?.value !== checkControl?.value) {
        controls.get(checkControlName)?.setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }
}
