import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent } from '@mui/material';

interface TransactionVerticalBarChartProps {
    expenseData?: any[];
    incomeData?: any[];
    labels?: any[]; 
}
const TransactionVerticalBarChart: React.FC<TransactionVerticalBarChartProps> = ({
    expenseData=[],
    incomeData=[],
    labels=[]
}) => {

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'Balance trend',
          },
        },
    };

    const data = {
        labels,
        datasets: [
            {
                label: 'Income',
                borderColor: 'rgb(92, 242, 170)',
                backgroundColor: 'rgb(40, 203, 124)',
                data: incomeData
            },
            {
                label: 'Expense',
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                data: expenseData
            },
        ]
    }
    return ( 
        <Card>
            <CardContent>
                <Bar options={options} data={data} />
            </CardContent>
        </Card>
    );
}
 
export default TransactionVerticalBarChart;