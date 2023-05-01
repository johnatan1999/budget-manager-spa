import React, { useState } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';

export interface ModalProps {
    onClose?: any;
    title?: string;
    top?: Number;
    show?: Boolean;
    closeOnClickOutside?: Boolean;
    width?: String | 'small' | 'medium' | 'large';
    children?: any;
    className?: string;
}

const Modal: React.FC<ModalProps> = ({
    onClose,
    children,
    title,
    show = false,
    top = 100,
    closeOnClickOutside = false,
    width = 'medium',
    className
}) => {
    
    const CloseModal = (event: any) => {
        if(onClose) onClose(event);
        // SetVisible(false);
    }

    useEffect(() => {
        document.body.style.overflow = show ? 'hidden' : 'unset';
    }, [show]);

    const ClickOutside = (event: any) => {
        if(closeOnClickOutside)
            if(event.target.classList.contains("modal-wrapper"))
                CloseModal(event);
    }

    return (
        <>
            {show && <Wrapper onClick={ClickOutside} topPosition={top} className={["modal-wrapper", className].join(' ')}>
                <div className={`m-content ${width}`}>
                    <div className="m-header">
                        <h5 className="modal-title">{ title }</h5>
                        <button type="button" onClick={CloseModal} className="close" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="m-body">
                        { children }
                    </div>
                    <div className="m-footer"></div>
                </div>
            </Wrapper>}
        </>
    );
}

const Wrapper = styled.div<{ topPosition: any }>`
    &.modal-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: ${props => props.topPosition}px;
        z-index: 2000;
    }
    .m-content {
        min-width: 370px;
        min-height: 10px;
        background-color: var(--white);
        box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
        border-radius: 5px;
    }
    .m-content.small {
        width: 100%;
        max-width: 370px;
    }
    .m-content.medium {
        width: 100%;
        max-width: 700px;
    }
    .m-content.large {
        width: 100%;
        max-width: 850px;
    }
    .m-header {
        min-height: 60px;
        background-color: var(--dark);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        color: var(--white);
        align-items: center;
        padding: 5px;
        border-radius: 5px 5px 0 0;
    }
    .modal-title {
        font-size: 16px;
        margin-top: 0;
        margin-bottom: 0;
        margin-left: 10px;
    }
    .m-header .close {
        color: white;
        height: 55px;
        width: 55px;
    }
    .m-body {
        display: flex;
        justify-content: center;
        padding: 20px;
    }
    .close {
        background-color: transparent;
        border: none;
        font-size: 40px;
        cursor: pointer;
    }
`;



export default Modal;