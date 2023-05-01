import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const TransactionFilterType = {
    TRANSACTION_TYPE: 'transaction-type',
    CATEGORIE: 'category'
}

export interface TransactionFilterProps {
    title?: string;
    data?: any[];
    onFilter: Function;
}

const TransactionFilter: React.FC<TransactionFilterProps> = ({
    title, 
    data=[],
    onFilter
}) => {
    const [selectedValues, setSelectedValues] = useState<any[]>([]);

    return (
        <Accordion elevation={0}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                // sx={{ minHeight: '40px' }}
            >
                <Typography sx={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }} >{title}({selectedValues.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <FormGroup>
                    {data.map((elt: any) => {
                        return (
                            <FormControlLabel 
                                key={elt.id} 
                                label={<span style={{ fontSize: '14px' }} >{elt.label}</span>}
                                control={<Checkbox onChange={(e) => {
                                    let values: any[] = [...selectedValues];
                                    if(e.target.checked) {
                                        values.push(elt.id);
                                    } else {
                                        values = values.filter((id) => id != elt.id);
                                    }
                                    onFilter(values);
                                    setSelectedValues(values);
                                }} />} 
                             />
                        )
                    })}
                </FormGroup>
            </AccordionDetails>
        </Accordion>
    );
}
 
export default TransactionFilter;