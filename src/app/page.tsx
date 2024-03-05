"use client";

import React, { useEffect, useState } from "react";
import { TickerData } from "types/Ticker";
import RankingData from "../listing.json";
import { CryptoInfo } from "@/components/CryptoInfo";
let CMC_CRYPTO_AMOUNT: number;
CMC_CRYPTO_AMOUNT = 10;

const Home = () => {
  let tickerArray = new Array<TickerData>(CMC_CRYPTO_AMOUNT);
  for (let i = 0; i < CMC_CRYPTO_AMOUNT; i++) {
    tickerArray[i] = {
      symbol: "",
      lastPrice: 0,
    };
  }
  const [ticker, setTicker] = useState<TickerData[]>(tickerArray);
  useEffect(() => {
    // cmc crypto listing json data reader
    let coinSymbolList: string[] = [];

    for (const key in RankingData) {
      if (key === "data") {
        for (const val of RankingData[key]) {
          if (val.symbol !== "USDT") coinSymbolList.push(val.symbol);
        }
      }
    }

    let coinPairs = coinSymbolList
      .filter((val, index) => {
        if (index < CMC_CRYPTO_AMOUNT) return val;
      })
      .map((val) => {
        return `${val}USDT`;
      });

    let coinTickerNames = coinPairs.map((val) => {
      return `tickers.${val}`;
    });

    const endpoint = "wss://stream.bybit.com/v5/public/spot";
    const ws = new WebSocket(endpoint);
    const apiCall = { op: "subscribe", args: coinTickerNames };

    ws.onopen = () => {
      console.log('"open" event!');
      console.log("WebSocket Client Connected");
      setInterval(() => {}, 3000);
      ws.send(JSON.stringify(apiCall));
    };

    //  購読した値を取得
    ws.onmessage = (event) => {
      const json = JSON.parse(event.data);
      try {
        if (json.data !== undefined) {
          coinPairs.forEach((val, index) => {
            if (json.data.symbol === val) {
              let lastPrice = Number(json.data.lastPrice);
              const tmp = [...tickerArray];
              tmp[index].symbol = json.data.symbol;
              tmp[index].lastPrice = lastPrice;
              setTicker(() => tmp);
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
  }, []);

  const showTickers = () => {
    return ticker.map((item, index) => (
      <div key={index}>
        <h2>{index + 1}</h2>
        <CryptoInfo symbol={item.symbol} lastPrice={item.lastPrice} />
      </div>
    ));
  };

  return (
    <main>
      <div>
        <ul>{showTickers()}</ul>
      </div>
    </main>
  );
};

export default Home;
