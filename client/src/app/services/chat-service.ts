import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { io, Socket } from "socket.io-client";
import { Message, User } from "../models/models";

const SERVER_URL = "https://heroku-chat-application-as.herokuapp.com/";

@Injectable()
export class ChatService {
  private socket: Socket = io(SERVER_URL);
  constructor() {}

  public connectedUser(user: User): void {
    this.socket.emit("connected", user);
  }

  public sendMessage(message: Message): void {
    this.socket.emit("message", message);
  }

  public stopTyping(user: User): void {
    this.socket.emit("stopTyping", user);
  }

  public typing(user: User): void {
    this.socket.emit("typing", user);
  }

  public onMessage(): Observable<Message> {
    return new Observable<Message>((observer) => {
      this.socket.on("message", (data: Message) => observer.next(data));
    });
  }

  public onGetUsersCount(): Observable<number> {
    return new Observable<number>((observer) => {
      this.socket.on("getUsersCount", (data: number) => observer.next(data));
    });
  }

  public onTyping(): Observable<User> {
    return new Observable<User>((observer) => {
      this.socket.on("typing", (data: User) => observer.next(data));
    });
  }

  public onStopTyping(): Observable<User> {
    return new Observable<User>((observer) => {
      this.socket.on("stopTyping", (data: User) => observer.next(data));
    });
  }

  public onDisconnected(): Observable<User> {
    return new Observable<User>((observer) => {
      this.socket.on("disconnected", (data: User) => observer.next(data));
    });
  }
}
