import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DataProcService } from '@services/data-proc.service';
import { FormsModule, NgForm } from '@angular/forms';
import { RegisterDataModel } from '@models/registerdata.models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  passwordDoNotMatch = signal<boolean>(false);
  invalidSurname = signal<boolean>(false);
  invalidBusinessName = signal<boolean>(false);
  invalidId = signal<boolean>(false);
  invalidName = signal<boolean>(false);
  router!: Router;
  dataproc!: DataProcService;

  constructor(router: Router, dataproc: DataProcService) {
    this.router = router;
    this.dataproc = dataproc;
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  _checkName(value: string) {
    this.invalidName.set(true);
    return value.trim().length > 0;
  }

  _checkSurname(value: string) {
    this.invalidSurname.set(true);
    return value.trim().length > 0;
  }

  _checkBusinessName(value: string) {
    this.invalidBusinessName.set(true);
    return value.trim().length > 0;
  }

  _checkId(value: number) {
    this.invalidId.set(true);
    return Number(value) > 0;
  }

  onSubmit(form: NgForm) {
    console.log('valores del form');
    console.log(form.value);
    if (!form.valid) return;
    const url = 'http://localhost:3000/users';
    const values = form.value as RegisterDataModel;
    if (values.password !== values.confirmPassword) {
      this.passwordDoNotMatch.set(true);
      return;
    }

    this.dataproc.sendData(url, values).subscribe({
      next: (response) => {
        console.log('Data posted successfully', response);
        console.log(form);
        this.navigateTo('');
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
