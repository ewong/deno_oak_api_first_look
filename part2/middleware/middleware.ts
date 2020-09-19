import { Request, Response } from "https://deno.land/x/oak@v6.2.0/mod.ts";

export async function timer(ctx: { response: Response }, next: any) {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${duration} ms`);
}

export async function logger(
  ctx: { request: Request; response: Response },
  next: any,
) {
  await next();
  const duration = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${duration}`);
}

export async function errorHandler(ctx: { response: Response }, next: any) {
  try {
    await next();
  } catch (err) {
    console.log(err);
    ctx.response.status = 500;
    ctx.response.body = { error: "Server error" };
  }
}
