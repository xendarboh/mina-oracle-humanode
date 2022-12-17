import type { Store } from "snarky-smt";
import { Level } from "level";
import { isReady, PublicKey } from "snarkyjs";
import invariant from "tiny-invariant";

import { BioAuthorizedAccount } from "~/mina.server";

// O: import type { Store } from "snarky-smt";
// O: import { LevelStore } from "snarky-smt";

invariant(process.env.STORAGE_MT, "STORAGE_MT must be set");
const db = process.env.STORAGE_MT;

type Storage = {
  ids: Store<PublicKey>;
  accounts: Store<BioAuthorizedAccount>;
};

let store: Storage;

declare global {
  var __store: Storage | undefined;
}

async function createStore(): Promise<Storage> {
  // wait for SnarkyJS to finish loading
  await isReady;

  // use dynamic import as snarky-smt needs snarkyjs isReady
  const { LevelStore } = await import("snarky-smt");

  const levelDb = new Level<string, any>(db);
  return {
    ids: new LevelStore<PublicKey>(levelDb, PublicKey, "ids"),
    accounts: new LevelStore<BioAuthorizedAccount>(
      levelDb,
      BioAuthorizedAccount,
      "accounts"
    ),
  };
}

async function getStore(): Promise<Storage> {
  if (process.env.NODE_ENV === "production") {
    store = await createStore();
    console.log("!!! created store");
  } else {
    if (!global.__store) {
      global.__store = await createStore();
      console.log("!!! created store");
    }
    store = global.__store;
  }
  return store;
}

export { getStore };
