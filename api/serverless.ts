import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createPublicClient, http, stringify } from "viem";
import { mainnet } from "viem/chains";
import { safeParseInput } from "./utils/safeParseInput";

export default async (request: VercelRequest, response: VercelResponse) => {
  const input = safeParseInput(request.query.block ?? "latest");
  if (input === undefined) {
    return response.status(400).send("Invalid block");
  }

  const client = createPublicClient({
    chain: mainnet,
    transport: http(),
  });

  const block = await client.getBlock(input);

  response.setHeader("Content-Type", "application/json");
  return response.send(stringify(block));
};
