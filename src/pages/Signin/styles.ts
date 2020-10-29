import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

import signinBackground from '../../assets/sign-in-background.png';

export const Container = styled.div`
  /* Como se fosse um 100%, mas eh 100 view port high */
  /* 100% da altura da tela do usuario */
  height: 100vh;
  /* Content e Backgrounf lado a lado */
  display: flex;
  /* faz com que as 2 secoes tenham os 100vh */
  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  /* o conteudo no centro da secao, horizontal e vertical */
  /* place-content: center; */

  /* Mesmo resultado, um alinha na hor. e outro na vert. */
  align-items: center;
  justify-content: center;

  /* ocupa 100% da div */
  width: 100%;
  max-width: 700px;
`;

const appearFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  animation: ${appearFromLeft} 1s;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
    }

    a {
      color: #F4EDE8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#F4EDE8')}
      }
    }
  }

  /* sinal de mario indica que eh a ancora dentro da div (fora do form) */
  /* sem esse sinal, esse style iria interferia na ancora de dentro do from */
  > a {
    color: #FF9000;
    display: block;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;

    display: flex;
    align-items: center;

    svg {
      margin-right: 16px;
    }

    &:hover {
      color: ${shade(0.2, '#FF9000')}
    }
  }
`;

export const Background = styled.div`
  /* ocupa todo espaco, menos os 700px da secao Content */
  flex: 1;
  background: url(${signinBackground}) no-repeat center;
  /* preenche todo espaco da div */
  background-size: cover;

`;
