import React from "react";
import { TickerData } from "types/Ticker";

export const CryptoInfo: React.FC<TickerData> = (props) => (
  <div>
    <li>{props.symbol}</li>
    <li>{props.lastPrice}</li>
  </div>
);
