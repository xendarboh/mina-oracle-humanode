import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { PrivateKey, isReady } from "snarkyjs";

// CORS
const headers = {
  "Access-Control-Allow-Origin": "*",
};

export async function loader() {
  invariant(
    process.env.MINA_ORACLE_PRIVATE_KEY,
    "MINA_ORACLE_PRIVATE_KEY must be set"
  );
  await isReady;
  const privateKey = PrivateKey.fromBase58(process.env.MINA_ORACLE_PRIVATE_KEY);
  const publicKey = privateKey.toPublicKey();
  const meta = {
    publicKey,
  };
  return json(meta, { headers });
}
