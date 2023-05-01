import React from 'react';
import styled from 'styled-components';

const Currency = ({value=0, currency='', color='', className=''}) => {

    return ( 
        <Wrapper style={color ? { color } : {}} className={['currency', value > 0 ? 'income' : 'expense', className].join(' ')}>
            {value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} {currency}
        </Wrapper>
    );
}

const Wrapper = styled.span`
    &.currency {
        font-size: 14px;
        font-weight: 600;
    }
    &.income {
        color: var(--green);
    }
    &.expense {
        color: var(--red);
    }
`;
 
export default Currency;