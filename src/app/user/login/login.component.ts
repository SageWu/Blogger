/**
 * @file 用户登录组件
 * @module app/user/login/component
 */

import { Component, HostListener, ViewChild, ElementRef } from "@angular/core";

import { UserService } from '@app/core/services/user.service';

enum Mode {
    Command,
    Login,
    Register
};

@Component({
    selector: "user-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
    private mode: Mode = Mode.Command;
    private ignore_keys: number[] = [
        9, 12, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46,
        91, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123,
        144, 145, 170, 171, 172, 173, 174, 175, 179, 180
    ];
    private header_len: number = 13;
    private hide_char: boolean = false;

    private account: string = "";
    private password: string = "";

    public messages: string[] = [
        `Tody: Sun Jan 27 16:33:54`,
        `you@robot:~$ What do you want to do?`,
        `[0]login`,
        `[1]register`,
        `you@robot:~$ `
    ];
    @ViewChild("terminalBody") terminal_ref: ElementRef;

    constructor(
        private userService: UserService
    ) {
    }

    //监听键盘事件
    @HostListener("window:keydown", ["$event"])
    private getInput(event: KeyboardEvent): boolean {
        let key_code: number = event.keyCode;
        //过滤键值
        let result: number = this.ignore_keys.find((value: number) => {
            if(value === key_code)
                return true;
            else
                return false;
        });
        if(result) {
            return true;
        }

        let message: string = this.messages.pop();
        let key: string = event.key;
        if(key_code === 8) {    //删除键
            if(message.length > this.header_len) {
                message = message.slice(0, message.length - 1);
                if(this.hide_char) {
                    this.password = this.password.slice(0, this.password.length - 1);
                }
            }

            this.messages.push(message);
        }
        else if(key_code !== 13) {  //除回车键以外
            if(this.hide_char) {    //密码输入
                message += '*';
                this.password += key;
            }
            else {
                message += key;
            }
            
            this.messages.push(message);
        }
        else {  //回车键
            this.messages.push(message);

            switch(this.mode) {
                case Mode.Command:
                    this.processCommand(event);
                    break;
                case Mode.Login:
                    this.login(event);
                    break;
                case Mode.Register:
                    this.register(event);
                    break;
            }
        }        

        requestAnimationFrame(() => {   //滑动至底部
            let terminal: HTMLDivElement = this.terminal_ref.nativeElement;
            terminal.scrollTop = terminal.scrollHeight;
        });

        return true;
    }

    //命令解析
    private processCommand(event: KeyboardEvent): void {
        let message: string = this.messages[this.messages.length - 1];
        let command: string = message.slice(this.header_len).trim();

        if(command === "0" || command === "login") {
            this.login(event);
        }
        else if(command === "1" || command === "register") {
            this.register(event);
        }
        else {
            this.messages.push("Please enter proper command.", "you@robot:~$ ");
        }
    }

    //登录
    private login(event: KeyboardEvent): void {
        if(this.mode !== Mode.Login) {  //进入登录模式
            this.mode = Mode.Login;
            let str: string = "Username: ";
            this.messages.push(str);
            this.header_len = str.length;

            return;
        }

        let message: string = this.messages[this.messages.length - 1];
        if(!this.hide_char) {   //获取帐号
            this.account = message.slice(this.header_len).trim();

            let str: string = "Password: ";
            this.messages.push(str);
            this.header_len = str.length;
            this.hide_char = true;
        }
        else {  //登录验证
            this.userService.login(this.account, this.password).subscribe(
                (value: boolean) => {
                    if(value) {

                    }
                    else {
                        
                    }
                }
            );
        }
    }

    //注册
    private register(event: KeyboardEvent): void {
        if(this.mode !== Mode.Register) {
            this.mode = Mode.Register;
            let str: string = "Username: ";
            this.messages.push(str);
            this.header_len = str.length;
        }


    }
}