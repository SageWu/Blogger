import { Component, AfterViewInit } from '@angular/core';
import { PreloaderService } from './core/services/preloader.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {
	constructor(
		private preloader: PreloaderService
	) {}

	ngAfterViewInit() {
		// setTimeout(() => {
		// 	this.preloader.stop();
		// }, 1000);
	}
}
