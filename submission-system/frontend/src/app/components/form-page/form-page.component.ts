import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.css']
})
export class FormPageComponent implements OnInit {
  submissionForm!: FormGroup;
  isSubmitting = false;
  submitSuccess = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.submissionForm = this.fb.group({
      full_name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[a-zA-Z\s]+$/) // only letters
        ]
      ],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      phone: ['', [Validators.required, Validators.pattern(/^[\d\s\+\-\(\)]{7,15}$/)]]
    });
  }

  get f() {
    return this.submissionForm.controls;
  }

  isInvalid(field: string): boolean {
    const control = this.submissionForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.submissionForm.invalid) {
      this.submissionForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.apiService.createSubmission(this.submissionForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;

        this.toastr.success('Submission Successful', 'Success', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true
        });

        this.submissionForm.reset();

        // Navigate after success
        setTimeout(() => {
          this.router.navigate(['/data']); // ← CHANGE THIS
        }, 1500);
      },
      error: () => {
        this.isSubmitting = false;

        this.toastr.error('Submission Failed', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true
        });
      }
    });
  }
}