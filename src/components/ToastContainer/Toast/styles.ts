import styled, { css } from 'styled-components';
import { animated } from 'react-spring';    // ver comentario abaixo sobre o uso de ANIMATED

interface ContainertProps {
    type?: 'info' | 'success' | 'error';
    hasDescription: number;
}

const toastTypeVariations = {
    info: css`
        background: #EBF8FF;
        color: #3172B7;
    `,
    success: css`
        background: #E6FFFA;
        color: #2E656A;
    `,
    error: css`
        background: #FDDEDE;
        color: #C53030;
    `,
};

// a animacao nao funciona em componentes convencionais tipo DIV, precisa dessa propriedade animated.
// export const Container = styled.div<ContainertProps>`
export const Container = styled(animated.div)<ContainertProps>`
    width: 360px;

    position: relative;
    padding: 16px 30px 16px 16px;
    border-radius: 10px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);

    display: flex;

    /* margem, caso tenha mais de um toast */
    & + div {
        margin-top: 8px;
    }

    /* utiliza o syle conforme props.type, senao INFO por padrao. */
    ${(props) => toastTypeVariations[props.type || 'info']}

    /* svg que esta no toast e nao no button */
    > svg {
        margin: 4px 12px 0 0;
    }

    div {
        flex: 1;

        p {
            margin-top: 4px;
            font-size: 14px;
            opacity: 0.8;
            line-height: 20px;
        }
    }

    button {
        position: absolute;
        right: 16px;
        top: 19px;
        opacity: 0.6;
        border: 0ch;
        background: transparent;
        color: inherit;
    }

    /* quando um toast nao tiver descricao (success) */
    ${(props) => !props.hasDescription && 
    css`
        align-items: center;

        svg {
            margin-top: 0;
        }
    `}
`; 