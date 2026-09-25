import type { Phase } from "./Phase";
import type { MaintenanceStatus } from "./MaintenanceStatus";

export interface PowerCircuit {
  id: number;
  circuit_code: string;
  phase: Phase;
  rated_amp: number;
  maintenance_status: MaintenanceStatus;
}
