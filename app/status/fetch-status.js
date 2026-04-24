import webserver from "infra/webserver";

export async function fetchStatus() {
  const response = await fetch(`${webserver.origin}/api/v1/status`);
  const json = await response.json();

  return json;
}
