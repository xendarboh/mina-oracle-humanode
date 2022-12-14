import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { isAuthenticated, requireAuthenticatedUser } from "~/auth.server";
import { getSignedBioAuth, cacheBioAuth } from "~/mina.server";
import { FormBioAuth } from "~/ui/FormBioAuth";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.id, "id required");
  const isAuthed = await isAuthenticated(request);
  console.log("isAuthed", isAuthed);
  let bioAuth = null;

  if (isAuthed) {
    const auth = await requireAuthenticatedUser(request);
    bioAuth = await getSignedBioAuth(params.id, auth.id);
    if (bioAuth) await cacheBioAuth(params.id, bioAuth);
  }

  return json({ bioAuth, isAuthed });
}

export default function MinaHumanodeAuth() {
  const { bioAuth, isAuthed } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col items-center space-y-8 ">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold">Mina x Humanode</h1>
        <h1 className="text-1xl font-bold">Zero-Knowledge Oracle</h1>
      </div>
      {isAuthed || <FormBioAuth />}
      <br />
      {bioAuth && <pre>{JSON.stringify(bioAuth, null, 2)}</pre>}
      <br />
      <br />
      {isAuthed && <Link to="/logout">Logout</Link>}
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  // if (caught.status === 404) {
  //   return <div>BioAuth not found</div>;
  // }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
