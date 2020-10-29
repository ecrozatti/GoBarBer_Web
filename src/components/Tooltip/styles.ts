import styled from 'styled-components';

export const Container = styled.div`
  /* todo position absolute que esta no container, vai ser relativo ao container e não ao restante da tela */
  position: relative;

  span {
    width: 160px;
    background: #FF9000;
    padding: 8px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    /* deixa transparente, mas a tooltip continua no form */
    opacity: 0;
    transition: opacity 0.4s;
    /* escode a tooltip do form */
    visibility: hidden;

    position: absolute;
    /* logo acima do icone com um acrescimo de 12px */
    bottom: calc(100% + 12px);
    /* centraliza com base no icone de alerta */
    left: 50%;
    /* deslifa no eixo x */
    transform: translateX(-50%);

    color: #312E38;

    &::before {
      content: '';
      /* hack para criar um triangulo apontando para o ícone de alerta */
      border-style: solid;
      /* cor para os tooltips da aplicacao */
      /* nos styles do Input, tratamos quando for erro e mudamos para cor vermelha */
      border-color: #FF9000 transparent;
      border-width: 6px 6px 0 6px;

      top: 100%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &:hover span {
    /* faz o processo inverso do acima para exibir a tooltip */
    opacity: 1;
    visibility: visible;
  }
`;
