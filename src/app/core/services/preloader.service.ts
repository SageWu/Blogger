/**
 * @file
 * @module
 */

import { Injectable, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";

const PRELOADER_NAME: string = "preloader";

@Injectable()
export class PreloaderService {
    private preloader: HTMLElement;

    constructor(
        @Inject(DOCUMENT) private document: Document
    ) {
        this.preloader = this.document.querySelector('#' + PRELOADER_NAME);
    }

    public start(): void {
        this.preloader.classList.add('.' + PRELOADER_NAME);
    }

    public stop(): void {
        this.preloader.classList.remove('.' + PRELOADER_NAME);
        console.log(this.preloader);
        this.preloader.className = "";
    }
}