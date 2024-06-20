import { FC, useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

import styles from "./styles.module.scss";
import { OptionData } from "types";

interface CodingChallengeProps {
  optionsData: OptionData[];
}

const CodingChallenge: FC<CodingChallengeProps> = ({ optionsData }) => {
  const chartCanvasRef = useRef<HTMLDivElement>(null);
  const [mxP, setMxP] = useState<number | null>(null);
  const [mxL, setMxL] = useState<number | null>(null);
  const [breakPt, setBreakPt] = useState<number[]>([]);

  useEffect(() => {
    calcRiskReward();
    initChart();
  }, [optionsData]);

  const calcRiskReward = () => {
    const results = optionsData.map((option) => {
      const profitLoss =
        option.long_short === "long" ? option.bid : -option.ask;
      return {
        strike_price: option.strike_price,
        profitLoss,
      };
    });

    setMxP(Math.max(...results.map((res) => res.profitLoss)));
    setMxL(Math.min(...results.map((res) => res.profitLoss)));
    setBreakPt(calcBreakPt(results));
  };

  const calcBreakPt = (
    results: { strike_price: number; profitLoss: number }[]
  ) => {
    const breakPt: number[] = [];

    for (let i = 1; i < results.length; i++) {
      const prev = results[i - 1];
      const curr = results[i];
      if (prev.profitLoss * curr.profitLoss < 0) {
        const breakEven =
          prev.strike_price +
          ((curr.strike_price - prev.strike_price) * (0 - prev.profitLoss)) /
            (curr.profitLoss - prev.profitLoss);
        breakPt.push(parseFloat(breakEven.toFixed(2)));
      }
    }

    return breakPt;
  };

  const initChart = () => {
    if (chartCanvasRef.current) {
      const chart = echarts.init(chartCanvasRef.current);

      // Prepare data for ECharts
      const xAxisData = optionsData.map((option) => option.strike_price);
      const seriesData = optionsData.map((option) =>
        option.long_short === "long" ? option.bid : -option.ask
      );

      // Set up ECharts options
      const option = {
        title: {
          text: "Options Strategy Risk & Reward Analysis",
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        tooltip: {
          trigger: "axis",
          formatter: "{b0} : {c0}",
        },
        xAxis: {
          type: "category",
          data: xAxisData,
          axisLabel: {
            formatter: "{value}",
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}",
          },
        },
        series: [
          {
            type: "line",
            data: seriesData,
            markPoint: {
              data: [
                { type: "max", name: "Max", itemStyle: { color: "#71ffbe" } },
                { type: "min", name: "Min", itemStyle: { color: "#ff758e" } },
              ],
            },
            markLine: {
              data: [{ type: "average", name: "Avg" }],
            },
            smooth: true,
          },
        ],
      };

      // Set options and render chart
      chart.setOption(option);
    }
  };

  return (
    <div className={styles.chartContainer}>
      <div
        ref={chartCanvasRef}
        style={{ width: "800px", height: "600px" }}
      ></div>
      {mxP !== null && (
        <div className={styles.results}>
          <p>
            <strong>Maximum Profit:</strong> {mxP}
          </p>
          <p>
            <strong>Maximum Loss:</strong> {mxL}
          </p>
          <p>
            <strong>Break Even Points:</strong>{" "}
            {breakPt.length > 0 ? breakPt.join(", ") : "None"}
          </p>
        </div>
      )}
    </div>
  );
};

export default CodingChallenge;
