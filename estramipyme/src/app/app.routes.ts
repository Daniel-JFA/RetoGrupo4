import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AppComponent } from './app.component';
import { EmptyComponent } from '@pages/empty/empty.component';
import { RegisterComponent } from '@pages/register/register.component';


export const routes: Routes = [
  // {path: "login", component: LoginComponent},
  {
    path: '',
    component: EmptyComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registro',
    component: RegisterComponent,
  },
];
