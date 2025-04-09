import { Routes } from '@angular/router';
import { ApplicationFormComponent } from './components/application-form/application-form.component';

export const routes: Routes = [
  { path: '', component: ApplicationFormComponent, pathMatch: 'full' },
  { path: '**', component: ApplicationFormComponent, pathMatch: 'full' },
];
