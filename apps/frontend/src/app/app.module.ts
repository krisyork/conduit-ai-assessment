import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RosterComponent } from './roster/roster.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [RosterComponent],
  imports: [CommonModule, RouterModule],
  exports: [RosterComponent]
  
})
export class AppModule { }