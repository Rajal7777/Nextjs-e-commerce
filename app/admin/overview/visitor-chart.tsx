'use client';

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

type VisitorChartProps = {
    data: {
        users: number;
        orders: number;
        products: number;
    };
};

const chartColors = [
  "#2563eb", // Blue
  "#16a34a", // Green
  "#f59e0b", // Amber
];

const VisitorChart = ({ data }: VisitorChartProps) => {
    const chartData = [
        { name: 'Users', value: data.users },
        { name: 'Orders', value: data.orders },
        { name: 'Products', value: data.products },
    ];
    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="relative h-87.5 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={78}
                        outerRadius={112}
                        paddingAngle={2}
                        strokeWidth={0}
                    >
                        {chartData.map((item, index) => (
                            <Cell key={item.name} fill={chartColors[index]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold tracking-tight">{total.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">Overview</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 text-xs text-muted-foreground">
                {chartData.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                        <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: chartColors[index] }}
                        />
                        <span>{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VisitorChart;
