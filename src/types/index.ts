export interface OptionData {
  strike_price: number;
  type: "Call" | "Put";
  bid: number;
  ask: number;
  long_short: "long" | "short";
  expiration_date: string;
}
