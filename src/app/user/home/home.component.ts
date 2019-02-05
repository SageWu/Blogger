/**
 * @file 用户主页组件
 * @module app/user/home/component
 */

import { Component, ViewChild, ElementRef } from "@angular/core";

@Component({
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"]
})
export class HomeComponent {
    @ViewChild("header") header_ref: ElementRef;
    @ViewChild("nav") nav_ref: ElementRef;
    @ViewChild("container") container_ref: ElementRef;
    public toggle_menu: boolean = false;

    public onScroll(event: Event) {
        let parent: EventTarget = event.target;
        let header: HTMLElement = this.header_ref.nativeElement;
        let nav: HTMLElement = this.nav_ref.nativeElement;
        let container: HTMLElement = this.container_ref.nativeElement;

        if(parent["scrollTop"] > header.clientHeight) {
            nav.style.position = "fixed";
            nav.style.top = "0px";            
            container.style.marginTop = nav.clientHeight + "px";
        }
        else {
            nav.style.position = "static";
            container.style.marginTop = "0px";
        }
    }

    public revealMenu() {
        this.toggle_menu = !this.toggle_menu;
        console.log(this.toggle_menu);
        
    }
}