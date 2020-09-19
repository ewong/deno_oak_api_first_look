import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import { v4 } from "https://deno.land/std@0.70.0/uuid/mod.ts";

export default class User {
  ukey?: string;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(email: string) {
    this.email = email;
  }

  // create
  static create(
    email: string,
    password: string,
  ): { data: any; error: boolean; status: number } {
    // check if user exists
    if (emailIndex.get(email) != undefined) {
      return { data: "User already exists", error: true, status: 400 };
    }

    // set the user
    const user = new User(email);
    user.ukey = v4.generate();
    const salt = bcrypt.gensalt(8);
    user.password = bcrypt.hashpw(password, salt);
    user.createdAt = new Date();
    user.updatedAt = new Date();

    // save user
    db.set(user.ukey!, user);
    emailIndex.set(user.email, user.ukey!);
    return { data: user, error: false, status: 201 };
  }

  // read
  static getByUkey(ukey: string) {
    const u = db.get(ukey);
    if (u == undefined)
      return undefined;
    const user = new User(u.email);
    user.ukey = u.ukey;
    user.password = u.password;
    user.createdAt = u.createdAt;
    user.updatedAt = u.updatedAt;
    return user;
  }

  // update
  save(): boolean {
    if (this.ukey == undefined || db.get(this.ukey!) == undefined) {
      return false;
    }
    const u = db.get(this.ukey!);
    emailIndex.delete(u!.email);
    this.updatedAt = new Date();
    db.set(this.ukey!, this);
    emailIndex.set(this.email, this.ukey!);
    return true;
  }

  // delete
  delete(): boolean {
    if (this.ukey == undefined || db.get(this.ukey!) == undefined) {
      return false;
    }
    db.delete(this.ukey!);
    emailIndex.delete(this.email);
    return true;
  }
}

// temp database
const db: Map<string, User> = new Map();
const emailIndex: Map<string, string> = new Map();
