import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';

@NgModule({
	imports: [
		BrowserModule,
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
