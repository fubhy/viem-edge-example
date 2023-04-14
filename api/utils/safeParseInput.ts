import { BlockTag } from "viem";

export function safeParseInput(
  value: unknown
): { blockTag: BlockTag } | { blockNumber: bigint } | undefined {
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
