import { useState } from "react";
import { login } from "../api/favorites";

export function LoginForm({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(username.trim());
      onLoggedIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
        className="rounded border px-3 py-2"
      />
      <button disabled={submitting} className="rounded bg-blue-600 px-3 py-2 text-white">
        {submitting ? "Logging in…" : "Log in"}
      </button>
      {error && <p role="alert" className="text-red-600">{error}</p>}
    </form>
  );
}