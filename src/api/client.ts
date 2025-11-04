import axios from "axios";
import type { components } from "./timeTrackingApi"; 

type TimeChanges = components["schemas"]["TimeChanges"];

export async function getTimeChanges(): Promise<TimeChanges[]> {
  const res = await axios.get("https://api.dummy.in-lotion.de/api/time-changes");
  
  return res.data as TimeChanges[];
}
