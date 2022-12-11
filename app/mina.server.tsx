import {
  Encoding,
  Field,
  Poseidon,
  PrivateKey,
  Signature,
  isReady,
} from "snarkyjs";

export async function getSignedAuth(_id: number, _bioAuthId: string) {
  // wait for SnarkyJS to finish loading
  await isReady;

  // The private key of our account.
  // When running locally the hardcoded key will be used.
  const privateKey = PrivateKey.fromBase58(
    process.env.PRIVATE_KEY ??
      "EKFALuhuMgHMoxVb3mwKS3Zx5yL9kg5TawbBoQaDq6bWqNE2GGBP"
  );

  // Compute the public key associated with our private key
  const publicKey = privateKey.toPublicKey();

  // Define a Field with the value of the id
  const id = Field(_id);

  // Define a Field with the current timestamp
  const timestamp = Field(Date.now());

  // Define a Field with the bioAuthId
  const bioAuthId = Poseidon.hash(Encoding.stringToFields(_bioAuthId));

  // Use our private key to sign an array of Fields containing the data
  const signature = Signature.create(privateKey, [id, timestamp, bioAuthId]);

  return {
    data: { id, timestamp, bioAuthId },
    signature: signature,
    publicKey: publicKey,
  };
}
