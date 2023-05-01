import React from 'react';
import { LinearProgress } from '@mui/material';
import { Card, CardContent } from '@mui/material';

const IncomeExpenseBarChart = ({
    totalIncome,
    totalExpense,
}) => {
    // const normalise = (value) => ((value - MIN) * 100) / (MAX - MIN);

    return (
        <Card>
            <CardContent>
                <LinearProgress variant="determinate" value={totalIncome} />
                <LinearProgress variant="determinate" value={totalExpense} />
            </CardContent>
        </Card>
    );
}
 
export default IncomeExpenseBarChart;