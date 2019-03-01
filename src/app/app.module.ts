import { BrowserModule, } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { ElModule } from "element-angular";

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';

@NgModule({
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		ElModule.forRoot(),
		AppRoutingModule,
		CoreModule
	],
	declarations: [
		AppComponent
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
