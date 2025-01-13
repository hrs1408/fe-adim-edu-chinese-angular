import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid) {
      if (this.f['username'].errors?.['required']) {
        this.toastr.error('Vui lòng nhập email', 'Lỗi');
      } else if (this.f['username'].errors?.['email']) {
        this.toastr.error('Email không đúng định dạng', 'Lỗi');
      } else if (this.f['password'].errors?.['required']) {
        this.toastr.error('Vui lòng nhập mật khẩu', 'Lỗi');
      } else if (this.f['password'].errors?.['minlength']) {
        this.toastr.error('Mật khẩu phải có ít nhất 6 ký tự', 'Lỗi');
      } else {
        this.toastr.error('Vui lòng điền đầy đủ thông tin', 'Lỗi');
      }
      return;
    }

    this.loading = true;
    this.authService.login(
      this.f['username'].value,
      this.f['password'].value
    ).subscribe({
      next: () => {
        this.toastr.success('Đăng nhập thành công', 'Thành công');
        this.router.navigate([this.returnUrl]);
      },
      error: error => {
        this.error = error?.message || 'Đăng nhập thất bại';
        this.toastr.error(this.error, 'Lỗi');
        this.loading = false;
      }
    });
  }
}
