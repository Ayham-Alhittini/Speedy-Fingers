import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NG_ASYNC_VALIDATORS, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  @ViewChild('authTabs', {static: true})authTabs: TabsetComponent;

  loading = false;
  passwordShown = false;

  constructor(private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToastrService,
    private fb: FormBuilder){}

  registerForm: FormGroup;
  submited = false;
  ngOnInit(): void {
    this.initializeForm();

    this.route.data.subscribe({
      next: data => {
        if (data['createAccount']) {
          this.selectTab('Create account');
        }
      }
    });
  }

  initializeForm() {
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{}[\]:;"'<>,.?/]).{8,}$/;
    
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(strongPasswordRegex)]],
      confirmPassword : ['', [Validators.required, this.matchValues()]],
      email: ['', [Validators.required, Validators.email]]
    });
    this.registerForm?.controls['password'].valueChanges.subscribe({
      next : () => {
        this.registerForm?.controls['confirmPassword'].updateValueAndValidity();
      }
    });
  }

  matchValues() : ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === this.registerForm?.controls['password'].value ? null : {notMatching : true};
    }
  }


  loginSubmit(loginForm: NgForm) {
      this.accountService.login(loginForm.value).subscribe({
        next: () => {
          this.router.navigateByUrl("/");
        }
      });
  }

  showPaswords() {
    this.passwordShown = this.passwordShown === true ? false : true;
  }

  register() {
    this.submited = true;
    if (this.registerForm.invalid) return;
    
    this.loading = true;
    this.accountService.register(this.registerForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.toaster.success("Account created successfully");
        this.router.navigateByUrl("/");
      }, error: () => this.loading = false
      
    })
  }

  onTabActivaited(data: TabDirective) {
    if (data.heading === 'Login') {
      this.router.navigateByUrl("/login");
    } else {
      this.router.navigateByUrl("/create-account");
    }
  }

  selectTab(heading: string) {
    if (this.authTabs) {
      this.authTabs.tabs.find(x => x.heading === heading).active = true;
    }
  }
}
