import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './application-form.component.html',
  styleUrl: './application-form.component.scss',
  providers: [DatePipe]
})
export class ApplicationFormComponent {
  userForm!: FormGroup;
  states = ['Gujarat', 'Mumbai'];
  cities: { [key: string]: string[] } = {
    'Gujarat': ['Surat', 'Navsari', 'Vadodara'],
    'Mumbai': ['Andheri', 'Bandra', 'Nevi Mumbai'],
  };

  constructor(private fb: FormBuilder, private datePipe: DatePipe) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.userForm.get('state')?.valueChanges.subscribe(state => {
      const cityControl = this.userForm.get('city');
      if (state) {
        cityControl?.enable();
        cityControl?.setValue('');
      } else {
        cityControl?.disable();
        cityControl?.setValue('');
      }
    });
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      users: this.fb.array([this.createUserFormGroup()])
    });
  }

  createUserFormGroup(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      gender: ['', Validators.required],
      dob: ['', [Validators.required, this.validateDate]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      state: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
    });
  }

  get users(): FormArray {
    return this.userForm.get('users') as FormArray;
  }

  addUser(): void {
    this.users.push(this.createUserFormGroup());
  }

  removeUser(index: number): void {
    if (this.users.length > 1) {
      this.users.removeAt(index);
    }
  }

  clearForm(): void {
    this.users.clear();
    this.users.push(this.createUserFormGroup());
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formattedUsers = this.userForm.value.users.map((user: any) => ({
        ...user,
        dob: this.datePipe.transform(user.dob, 'yyyy-MM-dd')
      }));
      console.log('User Details:', formattedUsers);
    } else {
      this.markFormGroupTouched(this.userForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }

  validateDate(control: any): { [key: string]: any } | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();

    if (selectedDate > currentDate) {
      return { 'futureDate': true };
    }

    return null;
  }

  onStateChange(index: number): void {
    const cityControl = this.users.at(index).get('city');
    cityControl?.setValue('');
  }
}
