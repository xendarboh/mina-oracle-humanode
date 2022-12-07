import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome to Remix</h1>
      <ul className="list-disc">
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/logout">Logout</Link>
        </li>
        <li>
          <Link to="/dashboard">dashboard</Link>
        </li>
      </ul>
    </div>
  );
}
