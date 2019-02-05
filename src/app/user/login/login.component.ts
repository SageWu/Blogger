/**
 * @file 用户登录组件
 * @module app/user/login/component
 */

import { Component, HostListener, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";

import { UserService } from '@app/core/services/user.service';
import { User } from '@app/core/models/user.model';

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
    private mode: Mode = Mode.Command;  //当前工作模式
    private ignore_keys: number[] = [   //过滤的键值
        9, 12, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46,
        91, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123,
        144, 145, 170, 171, 172, 173, 174, 175, 179, 180
    ];
    private header_len: number = 13;    //提示头长度
    private hide_char: boolean = false; //是否隐藏输入字符

    private account: string = "";
    private password: string = "";
    private confirm_password: string = "";

    public messages: string[] = [   //terminal记录
        `Tody: Sun Jan 27 16:33:54`,
        `you@robot:~$ What do you want to do?`,
        `[0]login`,
        `[1]register`,
        `you@robot:~$ `
    ];
    @ViewChild("terminalBody") terminal_ref: ElementRef;

    constructor(
        private userService: UserService,
        private router: Router
    ) {
    }

    //监听键盘事件
    @HostListener("window:keydown", ["$event"])
    private onInput(event: KeyboardEvent): boolean {
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
        else if(command === "help") {
            this.messages.push("XD hahaha", "you@robot:~$ ");
        }
        else {
            this.messages.push("Please enter proper command.", "you@robot:~$ ");
        }
    }

    //返回命令模式
    private back(): void {
        this.mode = Mode.Command;
        this.account = this.password = this.confirm_password = "";
        this.hide_char = false;
        let str: string = "you@robot:~$ ";
        this.header_len = str.length;
        this.messages.push(str);
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
                    if(value) { //登录成功
                        this.userService.get().subscribe(
                            (user: User) => {
                                if(user) {  //获取到用户数据
                                    this.router.navigate(["/user", "home"]);
                                }
                                else {  //获取用户数据失败
                                    this.messages.push("Failed to login.");
                                    this.back();
                                }
                            }
                        );
                    }
                    else {  //登录失败
                        this.messages.push("Failed to login.");
                        this.back();
                    }
                }
            );
        }
    }

    //注册
    private register(event: KeyboardEvent): void {
        if(this.mode !== Mode.Register) {   //进入注册模式
            this.mode = Mode.Register;
            let str: string = "Username: ";
            this.messages.push(str);
            this.header_len = str.length;

            return;
        }

        let message: string = this.messages[this.messages.length - 1];
        if(!this.hide_char) {   //获取帐号
            this.account = message.slice(this.header_len).trim();

            this.userService.isExist(this.account).subscribe(   //检查帐号是否已经存在
                (value: boolean) => {                    
                    if(value) {
                        this.messages.push("Account is already exist.", "Username: ");
                    }
                    else {
                        let str: string = "Password: ";
                        this.messages.push(str);
                        this.header_len = str.length;
                        this.hide_char = true;
                    }
                }
            );
        }
        else {  //获取密码
            if(this.confirm_password === "") {  //再次输入确认密码
                this.confirm_password = this.password;
                this.password = "";
                let str: string = "Confirm password: ";
                this.messages.push(str);
                this.header_len = str.length;
                this.hide_char = true;
            }
            else {  //注册
                if(this.password !== this.confirm_password) {   //两次输入密码不一致
                    this.password = this.confirm_password = "";
                    let str: string = "Password: ";
                    this.messages.push("The password entered is different.", str);
                    this.header_len = str.length;
                    this.hide_char = true;
                }
                else {
                    this.userService.create(this.account, this.password).subscribe(
                        (value: User) => {
                            if(value) { //注册成功
                                this.messages.push("Create account successfully.");
                                this.back();
                            }
                            else {  //注册失败
                                this.messages.push("Failed to create account.");
                                this.back();
                            }
                        }
                    );
                }
            }
        }
    }
}