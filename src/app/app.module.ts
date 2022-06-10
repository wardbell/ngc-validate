import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Address2FormComponent } from './address2-form/address2-form.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';

@NgModule({

  declarations: [
    Address2FormComponent
  ],

  imports: [
     MatInputModule,
     MatButtonModule,
     MatSelectModule,
     MatRadioModule,
     MatCardModule,
     ReactiveFormsModule
  ]
})
export class AppModule {

}
