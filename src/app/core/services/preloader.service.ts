/**
 * @file 加载页面控制服务
 * @module app/core/services/preloader/service
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
        requestAnimationFrame(() => {
            this.preloader.classList.toggle(PRELOADER_NAME);
        });
    }

    public stop(): void {
        requestAnimationFrame(() => {
            this.preloader.style.opacity = "0"; //渐渐消失
            setTimeout(() => {
                this.preloader.classList.toggle(PRELOADER_NAME);
            }, 1000);
        });
    }
}