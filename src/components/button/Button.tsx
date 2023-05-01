import React from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';

const CustomButton = ({
    className='',
    children,
    onClick
}) => {
    return ( 
        <Wrapper variant='contained' onClick={onClick} >
            {children}
        </Wrapper>
    );
}

const Wrapper = styled(Button)`
`;
 
export default CustomButton;