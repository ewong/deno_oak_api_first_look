import { RouteParams, Request, Response } from "https://deno.land/x/oak@v6.2.0/mod.ts";
import { v4 } from "https://deno.land/std@0.70.0/uuid/mod.ts";

// ------------- //
// CRUD handlers //
// ------------- //

// create user
export function userCreate(ctx: { request: Request; response: Response }) {
  const ukey = v4.generate();
  ctx.response.status = 201;
  ctx.response.body = { ukey };
}

// read user
export function userProfile(
  ctx: { params: RouteParams; request: Request; response: Response },
) {
  if (ctx.params == undefined || ctx.params.ukey == undefined) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid data" };
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = { ukey: ctx.params.ukey, email: "test@test.com" };
}

// update user
export function userUpdate(
  ctx: { params: RouteParams; request: Request; response: Response },
) {
  if (ctx.params == undefined || ctx.params.ukey == undefined) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid data" };
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = { ukey: ctx.params.ukey, email: "test2@test.com" };
}

// delete user
export function userDelete(
  ctx: { params: RouteParams; request: Request; response: Response },
) {
  if (ctx.params == undefined || ctx.params.ukey == undefined) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid data" };
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = {};
}
