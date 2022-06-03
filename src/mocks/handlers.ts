import { rest } from "msw";

export const handlers = [
  rest.post(
    "https://frosty-wood-6558.getsandbox.com:443/dishes",
    (req, res, ctx) => {
      return res(ctx.status(200));
    }
  ),
];
