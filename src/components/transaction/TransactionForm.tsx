import React, { useState } from 'react';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import InputAdornment from '@mui/material/InputAdornment';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import styled from 'styled-components';
import { ITransaction } from './ITransaction';
import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, OutlinedInput, Select, Stack, TextareaAutosize, TextField } from '@mui/material';
import dayjs from 'dayjs';

const TRANSACTION_TYPE = {
    EXPENSE: 'expense',
    INCOME: 'income'
}

const getTimeFromDate = (date: any) => {
    return `${date.$H}:${date.$m}:${date.$s}`;
}
/**
 * hh:mm:ss
 * @param time 
 */
const convertStringTimeToDate = (time: string) => {
    const [ hours, minutes, seconds ] = time.split(":");
    return new Date(0,0,0, parseInt(hours), parseInt(minutes), parseInt(seconds));
}

export interface TransactionFormProps {
    className?: string;
    labels?: any[];
    categories?: any[];
    onAddTransaction?: Function;
    onUpdateTransaction?: Function;
    defaultTransaction?: any;
} 

const TransactionForm: React.FC<TransactionFormProps> = ({
    className="",
    labels=[],
    categories=[],
    onAddTransaction,
    onUpdateTransaction,
    defaultTransaction
}) => {
    const type = defaultTransaction?.amount && defaultTransaction?.amount > 0 ? TRANSACTION_TYPE.INCOME : TRANSACTION_TYPE.EXPENSE; 
    const [transactionType, setTransactionType] = React.useState(type);
    const [transaction, setTransaction] = useState<ITransaction>({
        id: defaultTransaction?.id || undefined,
        amount: defaultTransaction?.amount ? Math.abs(defaultTransaction?.amount) : 0,
        description: defaultTransaction?.description || '',
        date: defaultTransaction?.date ? dayjs(new Date(defaultTransaction?.date)) : dayjs(new Date()),
        time: defaultTransaction?.time ? dayjs(convertStringTimeToDate(defaultTransaction?.time)) : dayjs(new Date()),
        category: defaultTransaction?.category
    });
    const [fieldsError, setFieldsError] = React.useState({
        category: false,
        amount: false,
        label: false,
        date: false,
        time: false
    });    

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        type: string,
    ) => {
        setTransactionType(type);
    };

    const handleInputChange = (e) => {
        setFieldsError({ ...fieldsError, [e.target.name]: e.target.value === undefined});
        setTransaction({ 
            ...transaction,
            [e.target.name]: e.target.value 
        });
    }

    const handleCategoryChange = (e) => {
        const newCategory = categories.find((c) => c.id === e.target.value);
        setFieldsError({ ...fieldsError, category: newCategory?.id === undefined});
        setTransaction({ 
            ...transaction,
            category: newCategory
        });
    }

    const handleDateChange = (e, fieldName) => {
        setTransaction({
            ...transaction,
            [fieldName]: e
        })
    }

    const formIsValid = () => {
        setFieldsError({
            ...fieldsError,
            amount: transaction.amount <= 0,
            category: transaction.category?.id == undefined
        });
        return transaction.amount > 0 && transaction.category?.id;
    }

    // const displayFieldError = () => {
        
    // }

    const handleSubmit = (e) => {
        if(formIsValid()) {
            if(transactionType === TRANSACTION_TYPE.EXPENSE)
                transaction.amount *= -1; 
            transaction.time = getTimeFromDate(transaction.time);
            transaction.source = { id: '1' };
            if(!transaction.description)
                transaction.description = transaction.category.name;
            if(!defaultTransaction)
                onAddTransaction(transaction);
            else onUpdateTransaction(transaction);
        }
    }


    return ( 
        <Wrapper className={['transaction-form', className].join(' ')}>
            <Box sx={{
                padding: '25px',
                paddingTop: '35px',
                paddingBottom: '16px',
            }}>
                <Box sx={{
                    padding: '0',
                    marginBottom: '10px'
                }}>
                    <div className='transaction-type'>
                        <ToggleButtonGroup
                            color="primary"
                            value={transactionType}
                            exclusive
                            fullWidth
                            onChange={handleChange}
                            aria-label="Platform"
                            >
                            <ToggleButton value={TRANSACTION_TYPE.EXPENSE}>Expense</ToggleButton>
                            <ToggleButton value={TRANSACTION_TYPE.INCOME}>Income</ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                    <div className='transaction-infos'>
                    <FormControl error={fieldsError.amount} sx={{ m: 1, width: '40%' }} variant="outlined">
                        <OutlinedInput
                            id="outlined-adornment-weight"
                            name='amount'
                            endAdornment={<InputAdornment position="end">MGA</InputAdornment>}
                            aria-describedby="outlined-weight-helper-text"
                            inputProps={{
                                'aria-label': 'amount',
                                'min': 0
                            }}
                            value={transaction.amount}
                            onChange={handleInputChange}
                            type="number"
                        />
                        {fieldsError.amount && <FormHelperText>The amount must be greater</FormHelperText>}
                    </FormControl>
                    </div>
                </Box>
                <Box sx={{
                    backgroundColor: 'white',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    marginBottom: '10px'
                }}>
                    <div className='transaction-infos'>
                        <FormControl sx={{width: '40%'}} error={fieldsError.category} >
                            <InputLabel id="demo-simple-select-label">Category</InputLabel>
                            <Select
                                labelId="category-label"
                                id="category-id"
                                name="category"
                                value={transaction.category?.id || ''}
                                label="Category"
                                onChange={handleCategoryChange}
                                required
                                
                                >
                                {categories.map((category, index) => <MenuItem 
                                    key={index}
                                    value={category.id}>{category?.name}</MenuItem>)}
                            </Select>
                            {fieldsError.category && <FormHelperText>Please select a category</FormHelperText>}
                        </FormControl>
                        <FormControl sx={{width: '40%'}} >
                            <InputLabel id="demo-simple-select-label">Label</InputLabel>
                            <Select
                                labelId="label"
                                id="label-id"
                                value={transaction.label?.id || ''}
                                label="Label"
                                onChange={handleInputChange}
                                required
                                >
                                {labels.map((label, index) => <MenuItem 
                                    key={index}
                                    value={label?.id}>{label?.description}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </div>
                    <div className='transaction-infos'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker 
                                value={dayjs(transaction.date)}
                                onChange={(newValue) => handleDateChange(newValue, 'date')}
                                sx={{width: '40%'}}
                            />
                            <MobileTimePicker
                                value={dayjs(transaction.time)}
                                onChange={(newValue) => handleDateChange(newValue, 'time')}
                                label={'"hours" and "minutes"'}
                                views={['hours', 'minutes']}
                                format="hh:mm"
                                sx={{width: '40%'}}
                            />
                        </LocalizationProvider>
                    </div>
                    {!defaultTransaction ? (
                        <Button sx={{
                            height: '40px',
                            minWidth: '200px', 
                            maxWidth: '60%',
                            margin: 'auto'
                        }} 
                        onClick={handleSubmit}
                        variant="contained"  
                        startIcon={<AddIcon/>}>Add</Button>
                    ) : (
                        <Button sx={{
                            height: '40px',
                            minWidth: '200px', 
                            maxWidth: '60%',
                            margin: 'auto'
                        }} 
                        onClick={handleSubmit}
                        variant="contained"  
                        startIcon={<EditIcon/>}>Update</Button>
                    )}
                </Box>
            </Box>
            <Box sx={{
                padding: '35px',
                paddingTop: '50px',
                width: '40%'
            }}>
                <InputLabel>Description</InputLabel>
                <TextareaAutosize 
                    name="description"
                    id="desc"
                    value={defaultTransaction?.description}
                    onChange={handleInputChange}
                    style={{
                        width: '100%',
                        height: 'calc(100% - 80px)',
                    }}
                /> 
            </Box>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    &.transaction-form {
        width: 100%;
        display: flex;
    }
    .transaction-type {
        display: flex;
        width: 80%;
        margin: auto;
        justify-content: space-around;
        margin-bottom: 40px;
    }
    .transaction-infos {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        margin-bottom: 40px;
    }
`;

export default TransactionForm;