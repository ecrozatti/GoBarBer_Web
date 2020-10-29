import React, { ButtonHTMLAttributes } from 'react';
// import { boolean } from 'yup';

import { Container } from './styles';

// interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
//   ...
// }

// essa sintaxe representa a mesna coisa que acima. (automatico do Eslint)
// Isso acontece quando nao sobrescrevemos nada, apenas estendemos
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
   // recebe as propriedades de um button e (&) uma propridade definida como loading do tipo boolean
   loading?: boolean;
};

// Tambem passa como parametro, todas as propriedades possiveis de um BUTTON
// Aqui desestruturamos PROPS em children (texto no button) e ...rest (restante das props)
const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => (
  <Container type="button" {...rest}>
    {loading ? 'Carregando...' : children}
  </Container>
);

export default Button;
