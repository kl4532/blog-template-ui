import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { NavbarComponent } from './navbar/navbar.component';
import {RouterModule} from '@angular/router';
import { FormsModule} from '@angular/forms';
import { ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxDropzoneModule } from 'ngx-dropzone';


@NgModule({
  declarations: [NavbarComponent, ConfirmDialogComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    NgxDropzoneModule,
    HttpClientModule
  ],
  exports: [
    CommonModule,
    MaterialModule,
    NavbarComponent,
    RouterModule,
    FormsModule,
    ConfirmDialogComponent,
    NgxDropzoneModule,
    HttpClientModule
  ]
})
export class SharedModule { }
