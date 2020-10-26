import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { NavbarComponent } from './navbar/navbar.component';
import {RouterModule} from '@angular/router';
import { FormsModule} from '@angular/forms';
import { ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';


@NgModule({
  declarations: [NavbarComponent, ConfirmDialogComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    MaterialModule,
    NavbarComponent,
    RouterModule,
    FormsModule,
    ConfirmDialogComponent
  ]
})
export class SharedModule { }
