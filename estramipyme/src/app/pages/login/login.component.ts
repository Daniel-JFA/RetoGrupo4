import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {FormsModule, NgForm} from "@angular/forms";
import {DataProcService} from "@services/data-proc.service";
import {RegisterDataModel} from "@models/registerdata.models";
import {GlobalProviderService} from "@services/global-provider.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  router!: Router;
  dataproc!: DataProcService;
  globalProvider!: GlobalProviderService;

  constructor(router: Router, dataproc: DataProcService, globalProvider: GlobalProviderService) {
    this.router = router;
    this.dataproc = dataproc
    this.globalProvider = globalProvider
  }

  navigateTo(path: string) {
    this.router.navigate([path])
  }


  onSubmit(form: NgForm) {
    if (!form.valid) return;
    const values = form.value as RegisterDataModel
    const url = `http://localhost:3000/users/?email=${values.email}`

    this.dataproc.getData(url).subscribe({
      next: (response) => {
        const res = response as RegisterDataModel[];
        res.forEach(item => {
          if (item.password === values.password) {
            this.globalProvider.setLogging(true)
            this.navigateTo("")
          }
        });
      },
      error: err => {
        console.error('Data ', err)
      }
    })
  }
}
