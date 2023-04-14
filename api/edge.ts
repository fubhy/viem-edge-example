import { createPublicClient, http, stringify } from "viem";
import { mainnet } from "viem/chains";
import { safeParseInput } from "./utils/safeParseInput";

export default async (request: Request) => {
  const url = new URL(request.url);
  const input = safeParseInput(url.searchParams.get("block") ?? "latest");
  if (input === undefined) {
    return new Response("Invalid block", {
      status: 400,
    });
  }

  const client = createPublicClient({
    chain: mainnet,
    transport: http(),
  });

  const block = await client.getBlock(input);

  return new Response(stringify(block), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const config = {
  runtime: "edge",
};
