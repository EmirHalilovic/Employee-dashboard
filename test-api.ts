import { getTimeChanges } from "./src/api/client";

async function test() {
  const data = await getTimeChanges();
  console.log("Fetched entries:", data.length);
  console.log("First entry:", data[0]);
}

test();
