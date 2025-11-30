"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { time: "09:00", price: 1.0712 },
  { time: "09:05", price: 1.0715 },
  { time: "09:10", price: 1.0714 },
  { time: "09:15", price: 1.0718 },
  { time: "09:20", price: 1.0720 },
  { time: "09:25", price: 1.0719 },
  { time: "09:30", price: 1.0722 },
  { time: "09:35", price: 1.0721 },
  { time: "09:40", price: 1.0725 },
  { time: "09:45", price: 1.0723 },
]

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
}

export function ForexAnalysisChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          domain={['dataMin - 0.0005', 'dataMax + 0.0005']}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `${value.toFixed(4)}`}
        />
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Legend />
        <Line
          dataKey="price"
          type="monotone"
          stroke="var(--color-price)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}
