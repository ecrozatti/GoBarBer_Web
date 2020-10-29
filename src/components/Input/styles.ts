import styled, { css } from 'styled-components';

import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
}

// Criar a interface e enviamos como parametro para tratar a usabilidade
export const Container = styled.div<ContainerProps>`
  background: #232129;
  border-radius: 10px;
  border: 2px solid #232129;
  padding: 16px;
  width: 100%;
  color: #666360;

  display: flex;
  align-items: center;

  & + div {
    margin-top: 8px;
  }

  /** estilo qdo o container/input apresenta erro de validação */
  ${(props) => props.isErrored
    && css`
      border-color: #C53030;
    `}

  /** estilo qdo o cursor esta no container/input */
  ${(props) => props.isFocused
    && css`
      color: #FF9000;
      border-color: #FF9000;
    `}

  /** estilo qdo o container/input está preenchido */
  ${(props) => props.isFilled
    && css`
      color: #FF9000;
    `}

  input {
    flex: 1;
    background: transparent;
    border: 0;
    color: #F4EDE8;

    &::placeholder {
      color: #666360;
    }
  }

  /* icone de identificação do input (esquerda) */
  svg {
    margin-right: 16px;
  }
`;

// styled(Tooltip) -> vamos estilizar um Tooltip
export const Error = styled(Tooltip)`
  /* tamanho fixo/exato do icone, pq o container estava aumentando um pouco. */
  height: 20px;
  /* margem para o texto do input não encostar no ícone de alerta */
  margin-left: 16px;

  /* icone de alerta de erro no input (direita) */
  svg {
    margin-right: 0px;
  }

  /* tooltip de erro */
  span {
    background: #C53030;
    color: #FFF;

    /* flechinha */
    &::before {
      border-color: #C53030 transparent;
    }
  }
`;
