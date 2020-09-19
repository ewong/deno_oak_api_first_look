import type { RouteParams, Request, Response } from "https://deno.land/x/oak@v6.2.0/mod.ts";
import User from "../models/user.ts";

// ------------- //
// CRUD handlers //
// ------------- //

// create user
export async function userCreate({ request, response }: { request: Request; response: Response }) {
  const req = request.body();
  const data = await req.value;
  if (data == undefined || data.email == undefined || data.password == undefined) {
    response.status = 400;
    response.body = { error: "Invalid data" };
    return;
  }

  const result = await User.create(data.email, data.password);
  response.status = result.status;
  if (result.error) {
    response.body = { error: result.data };
    return;
  }
  response.body = { ukey: result.data.ukey, email: result.data.email };
}

// read user
export function userProfile(
  { params, request, response }: { params: RouteParams; request: Request; response: Response },
) {
  if (params == undefined || params.ukey == undefined) {
    response.status = 400;
    response.body = { error: "Invalid data" };
    return;
  }

  // check if user exists
  const user = User.getByUkey(params.ukey);
  if (user == undefined) {
    response.status = 404;
    response.body = { error: "User not found" };
    return;
  }

  response.status = 200;
  response.body = { ukey: params.ukey, email: user.email };
}

// update user
export async function userUpdate({ params, request, response }: { params: RouteParams; request: Request; response: Response }) {
  if (params == undefined || params.ukey == undefined) {
    response.status = 400;
    response.body = { error: "Invalid data" };
    return;
  }

  // check body
  const result = request.body();
  const data = await result.value;
  if (data == undefined || data.email == undefined) {
    response.status = 400;
    response.body = { error: "Invalid data" };
    return;
  }

  // check if user exists
  const user = User.getByUkey(params.ukey);
  if (user == undefined) {
    response.status = 404;
    response.body = { error: "User not found" };
    return;
  }

  // update user
  user.email = data.email;
  if (user.save()) {
    response.status = 200;
    response.body = { ukey: params.ukey, email: user.email };
    return;
  }

  response.status = 500;
  response.body = { error: "Server error" };
}

// delete user
export function userDelete({params, request,response}: { params: RouteParams; request: Request; response: Response }) {
  if (params == undefined || params.ukey == undefined) {
    response.status = 400;
    response.body = { error: "Invalid data" };
    return;
  }

  // check if user exists
  const user = User.getByUkey(params.ukey);
  if (user == undefined) {
    response.status = 404;
    response.body = { error: "User not found" };
    return;
  }

  // delete user
  user.delete();
  response.status = 200;
  response.body = {};
}
