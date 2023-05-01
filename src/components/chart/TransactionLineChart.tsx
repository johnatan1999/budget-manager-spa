import React from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardContent } from '@mui/material';
import { Chart as ChartJS } from 'chart.js';
import type { InteractionItem } from 'chart.js';
import { 
  getDatasetAtEvent,
  getElementAtEvent,
  getElementsAtEvent,
} from 'react-chartjs-2';

interface TransactionLineChartProps {
    expenseData?: any[];
    incomeData?: any[];
    labels?: any[]; 
    onSelectPoint?: Function;
    elevation?: number;
}
const TransactionLineChart: React.FC<TransactionLineChartProps> = ({
    expenseData=[],
    incomeData=[],
    labels=[],
    onSelectPoint,
    elevation
}) => {

    const chartRef = React.useRef<ChartJS<"line">>();

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
            
        ]
    }

    if(incomeData.length > 0) {
        data.datasets.push({
            label: 'Income',
            borderColor: 'rgb(92, 242, 170)',
            backgroundColor: 'rgb(40, 203, 124)',
            data: incomeData
        });
    } 
    if(expenseData.length > 0) {
        data.datasets.push({
            label: 'Expense',
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            data: expenseData
        });
    }

    // React.useEffect(()=>{
    //     console.log(chartRef)
    // }, [chartRef])

    const getSelectedElement = (element: InteractionItem[]) => {
        if (!element.length) return;
    
        const { datasetIndex, index } = element[0];
    
        // console.log(data.labels[index], data.datasets[datasetIndex].data[index]);
        const value = data.datasets[datasetIndex].data[index];
        return { date: data.labels[index], value: datasetIndex == 0 ? value : -value }
      };
      
      const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if(onSelectPoint) {
            const { current: chart } = chartRef;
            const selectedPoint = getSelectedElement(getElementAtEvent(chart, e));
            onSelectPoint(selectedPoint);
        }
    }

    return ( 
        <Card elevation={elevation} >
            <CardContent>
                <Line
                    ref={chartRef}
                    onClick={handleClick}
                    options={options}
                    data={data}
                />
            </CardContent>
        </Card>
    );
}
 
export default TransactionLineChart;