import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RosterComponent } from './roster/roster.component';

@NgModule({
  declarations: [RosterComponent],
  imports: [CommonModule],
  exports: [RosterComponent]
})
export class AppModule { }