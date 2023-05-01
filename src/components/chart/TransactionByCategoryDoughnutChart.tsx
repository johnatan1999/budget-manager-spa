import React, { useMemo, MouseEvent, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Card, CardContent, CardHeader } from '@mui/material';
import Currency from '../currency/Currency';
import styled from 'styled-components';
import { Chart as ChartJS } from 'chart.js';
import type { InteractionItem } from 'chart.js';
import { 
  getDatasetAtEvent,
  getElementAtEvent,
  getElementsAtEvent,
 } from 'react-chartjs-2';


const TransactionByCategoryDoughnutChart = ({
    transactionData,
    title='',
    total=0,
    onSelectCategory
}) => {
  
    const chartRef = useRef<any>(null);

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: title,
          },
        },
    };

    const { chartData, labels } = useMemo(() => {
        return {
            chartData: transactionData.map((elt) => elt.totalAmount),
            labels: transactionData.map((elt) => elt.category.name),
        }
    }, [transactionData]);

    const data = {
        labels,
        datasets: [
          {
            label: '# Total',
            data: chartData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
    };

    const getSelectedCategory = (element: InteractionItem[]) => {
      if (!element.length) return;
  
      const { datasetIndex, index } = element[0];
  
      // console.log(data.labels[index], data.datasets[datasetIndex].data[index], transactionData[index]);
      return transactionData[index];
    };
    
    const handleClick = (e: MouseEvent<HTMLCanvasElement>) => {
      const { current: chart } = chartRef;
      const category = getSelectedCategory(getElementAtEvent(chart, e));
      if(onSelectCategory) {
        onSelectCategory(category);
      }
    }

    return ( 
        <Wrapper>
            <CardHeader
              title={<Currency className="total-amount" currency='Ar' value={total} />}
            />
            <CardContent>
                <Doughnut 
                  ref={chartRef} 
                  onClick={handleClick} 
                  data={data} 
                  options={options} 
                />
            </CardContent>
        </Wrapper>
    );
}

const Wrapper = styled(Card)`
  .total-amount {
    font-size: 20px;
    float: right;
  }
`;
 
export default TransactionByCategoryDoughnutChart;