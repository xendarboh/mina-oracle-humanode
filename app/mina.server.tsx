import {
  Encoding,
  Field,
  Poseidon,
  PrivateKey,
  PublicKey,
  Signature,
  isReady,
  Struct,
  UInt64,
  CircuitString,
} from "snarkyjs";
import invariant from "tiny-invariant";

// O: import { SparseMerkleTree } from "snarky-smt";

import { cache } from "./cache.server";
import { getStore } from "./store.server";

const TTL = Number(process.env.MINA_ORACLE_BIOAUTH_TTL) ?? 1000 * 60 * 10;

export async function cacheBioAuth(id: string, data: any) {
  cache.set(id, JSON.stringify(data), TTL);
}

export async function getCachedBioAuth(id: string): Promise<any | undefined> {
  return cache.has(id) ? JSON.parse(cache.get(id) as string) : undefined;
}

// from snarky-bioauth library
function payloadFromBase58(id: string): Field {
  const publicKey = PublicKey.fromBase58(id);
  return publicKey.x;
}

export async function getSignedBioAuth(_id: string, _bioAuthId: string) {
  invariant(
    process.env.MINA_ORACLE_PRIVATE_KEY,
    "MINA_ORACLE_PRIVATE_KEY must be set"
  );

  // wait for SnarkyJS to finish loading
  await isReady;

  // The private key of our account.
  const privateKey = PrivateKey.fromBase58(process.env.MINA_ORACLE_PRIVATE_KEY);

  // Compute the public key associated with our private key
  const publicKey = privateKey.toPublicKey();

  // Define a Field with the value of the id
  const payload = Field(payloadFromBase58(_id));

  // Define a Field with the current timestamp
  const timestamp = Field(Date.now());

  // Define a Field with the bioAuthId
  const bioAuthId = Poseidon.hash(Encoding.stringToFields(_bioAuthId));

  // Use our private key to sign an array of Fields containing the data
  const signature = Signature.create(privateKey, [
    payload,
    timestamp,
    bioAuthId,
  ]);

  return {
    data: { payload, timestamp, bioAuthId },
    signature: signature,
    publicKey: publicKey,
  };
}

////////////////////////////////////////////////////////////////////////
// Identity Registration
////////////////////////////////////////////////////////////////////////

// from (or to, as dev'ing here) snarky-bioauth

export class BioAuthorizedAccount extends Struct({
  publicKey: PublicKey,
  ttl: UInt64,
}) {
  // ??? This seems to break LevelStore
  // incrementTTL(microseconds: number): BioAuthorizedAccount {
  //   return new BioAuthorizedAccount({
  //     publicKey: this.publicKey,
  //     ttl: this.ttl.add(microseconds),
  //   });
  // }
}

export async function registerAccount(
  bioAuthId: string,
  publicKeyBase58: string
) {
  const store = await getStore();

  // use dynamic import as snarky-smt needs snarkyjs isReady
  const { SparseMerkleTree } = await import("snarky-smt");

  const smt = await SparseMerkleTree.build<CircuitString, PublicKey>(
    store.ids,
    CircuitString,
    PublicKey as any
  );

  const human = CircuitString.fromString(bioAuthId);
  const publicKey = PublicKey.fromBase58(publicKeyBase58);

  await smt.update(human, publicKey);
  const initCommitment = smt.getRoot();
  console.log("!! initCommitment", initCommitment);
}
