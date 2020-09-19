import { Application, Router } from "https://deno.land/x/oak@v6.2.0/mod.ts";
import "https://deno.land/x/dotenv@v0.5.0/load.ts";

import { timer, logger, errorHandler } from "./middleware/middleware.ts";
import {
  userCreate,
  userProfile,
  userUpdate,
  userDelete,
} from "./handlers/user.ts";

const app = new Application();

// middleware
app.use(logger);
app.use(timer);
app.use(errorHandler);

// routes
const router = new Router();
router
  .post("/api/user", userCreate)
  .get<{ ukey: string }>("/api/user/:ukey", userProfile)
  .put<{ ukey: string }>("/api/user/:ukey", userUpdate)
  .delete<{ ukey: string }>("/api/user/:ukey", userDelete);
app.use(router.routes());
app.use(router.allowedMethods());

// listen
app.listen({ port: parseInt(Deno.env.get("PORT")!) });
console.log(`Server started at port ${Deno.env.get("PORT")!}`);
