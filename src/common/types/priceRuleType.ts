export type CalculateChargeBody = {
  duration: number;
  id: number;
  vehicle_type: number;
  watt: number
};

export type CalculateDurationBody = {
  id: number
  total_charge: number
  vehicle_type: number
  watt: number
};