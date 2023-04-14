import { BlockTag, createPublicClient, http, stringify } from "viem";
import { mainnet } from "viem/chains";

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
      "Cache-Control": "s-maxage=60",
    },
  });
};

function safeParseInput(value: unknown) {
  try {
    if (
      typeof value === "string" &&
      ["latest", "earliest", "pending", "safe", "finalized"].includes(value)
    ) {
      return {
        blockTag: value as BlockTag,
      };
    } else if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "bigint"
    ) {
      return {
        blockNumber: BigInt(value),
      };
    }
  } catch {
    return undefined;
  }
}

export const config = {
  runtime: "edge",
};
