import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Profile } from '../models/profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  constructor(private fb: FormBuilder, private accountService: AccountService,
    private toaster: ToastrService){}

  passwordShown = false;
  profile: Profile;

  selectedLayout: string = null;
  changePasswordForm: FormGroup;

  keyboardLayouts: string[] = [
    'Qwerty-based',
    'Neo',
    'Colemak',
    'Dvorak',
    'Maltron',
    'Turkish (F-Keyboard)',
    'Workman',
    'Azerty',
    'Stenotype'
  ];

  ngOnInit(): void {
    this.initializeChangePasswordForm();
    this.loadProfileData();
  }

  loadProfileData() {
    this.accountService.getProfile().subscribe({
      next: response => {
        this.profile = response;
        this.selectedLayout = this.profile.keyboardLayout;
      }
    });
  }

  updateKeyboardLayout() {
    if (this.selectedLayout) {
      this.accountService.updateKeyboardLayout(this.selectedLayout).subscribe({
        next: () => this.toaster.success("Layout updated")
      })
    }
  }

  initializeChangePasswordForm() {
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{}[\]:;"'<>,.?/]).{8,}$/;
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(strongPasswordRegex)]],
      confirmNewPassword: ['', [Validators.required, this.matchValues()]]
    });
    
    this.changePasswordForm?.controls['newPassword'].valueChanges.subscribe({
      next : () => {
        this.changePasswordForm?.controls['confirmNewPassword'].updateValueAndValidity();
      }
    });
  }

  matchValues() : ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === this.changePasswordForm?.controls['newPassword'].value ? null : {notMatching : true};
    }
  }

  changePassword() {
    this.accountService.changePassword(this.changePasswordForm.value).subscribe({
      next: () => {
        this.toaster.success("Password Changed Successfuly");
        this.changePasswordForm.reset();
      },
    });
  }

  showPaswords() {
    this.passwordShown = this.passwordShown === true ? false : true;
  }
}
