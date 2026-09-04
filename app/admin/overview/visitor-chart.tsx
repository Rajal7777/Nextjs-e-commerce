'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

type VisitorChartProps = {
    data: {
        users: number;
        orders: number;
        products: number;
    };
};

const CHART_COLORS = [
    "#2563eb", // Blue (Users)
    "#16a34a", // Green (Orders)
    "#f59e0b", // Amber (Products)
];

const VisitorChart = ({ data }: VisitorChartProps) => {
    const chartData = [
        { name: 'Users', value: data.users || 0 },
        { name: 'Orders', value: data.orders || 0 },
        { name: 'Products', value: data.products || 0 },
    ];

    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="relative h-87 w-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "hsl(var(--popover))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "0.5rem",
                            fontSize: "12px",
                            color: "hsl(var(--popover-foreground))",
                        }}
                        formatter={(value) => [Number(value ?? 0).toLocaleString(), "Count"]}
                    />
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={75}
                        outerRadius={105}
                        paddingAngle={total > 0 ? 3 : 0}
                        strokeWidth={0}
                    >
                        {chartData.map((item, index) => (
                            <Cell key={item.name} fill={CHART_COLORS[index]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

            {/* Center Donut Label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-8">
                <span className="text-3xl font-bold tracking-tight">
                    {total.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                    Total Items
                </span>
            </div>


            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-2">
                {chartData.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2">
                        <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: CHART_COLORS[index] }}
                        />
                        <span className="font-medium text-foreground">{item.name}:</span>
                        <span>{item.value.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VisitorChart;