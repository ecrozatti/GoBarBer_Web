import React from 'react';
import { useTransition } from 'react-spring';

import Toast from './Toast';

import { ToastMessage } from '../../hooks/toast';
import { Container } from './styles';

interface ToastContainerProps {
    messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
    // 1. parametro: sao nossas mensagens
    // 2. parametro: eh uma funcao que recebe a chave dessas mensagens
    // 3. parametro: eh o objeto contendo as animacoes
    const messagesWithTransitions = useTransition(
        messages, 
        message => message.id,
        {
            from: { right: '-120%', opacity: 0 },   // iniia em -120, fora da tela
            enter: { right: '0%', opacity: 1 },     // qdo a mensagem entrar, corre ate a posicao correta   
            leave: { right: '-120%', opacity: 0 },  // depois, volta para a possicao de origem
        }
    );

    return (
        <Container>
            {/* {messages.map(message => (
                <Toast key={message.id} message={message} />
            ))} */}

            {/* usando a animacao passa a ficar dessa forma */}
            {/* item eh nossa MESSAGE e props contem o CSS da animacao (preicsa passar) */}
             
            {messagesWithTransitions.map(({ item, key, props }) => (
                <Toast key={key} message={item} style={props} />
            ))}
        </Container>
    );
};

export default ToastContainer;