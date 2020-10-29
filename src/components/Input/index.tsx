import React, {
  InputHTMLAttributes, useEffect, useRef, useState, useCallback,
} from 'react';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';

import { Container, Error } from './styles';

// interface que contem todas as propriedades disponiveis para um INPUT
// sobrescrevemos o InputHTMLAttributes, dizendo que NAME eh obrigatorio
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  // name passa a ser obrigatorio
  name: string;
  // usado no Profile para espacar um input esepcifico
  containerStyle?: object;
  // recebe um COMPONENTE como uma propriedade
  // IconBaseProps = conseguimos saber todas as proidades de icon
  icon?: React.ComponentType<IconBaseProps>;
}

// passa como parametro as propridades possiveis de um INPUT
// pegamos em "props" e utilizamos dentro do elemento
// renomeamo icon para Icon, pq ele precisa ter a letra maiuscula (componente)
const Input: React.FC<InputProps> = ({ name, containerStyle = {}, icon: Icon, ...rest }) => {
  // armazena a referência de um Input
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const {
    fieldName, defaultValue, error, registerField,
  } = useField(name);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  // ver anotações do Notion sobre useCallback
  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    setIsFilled(!!inputRef.current?.value);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      // dentro de current esta nossa referencia ao input no HTML
      ref: inputRef.current,
      // o valor digitado no input esta sempre em .value
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container style={containerStyle} isErrored={!!error} isFocused={isFocused} isFilled={isFilled}>
      {/* se tiver icone, exibe e redimensiona o tamanho */}
      {Icon && <Icon size={20} />}
      {/* referencia utilizada acima */}
      {/* <input defaultValue={defaultValue} ref={inputRef} {...rest} /> */}
      {/* onFocus = qdo recebe o focus. onBlur = qdo perde o focus */}
      <input
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={inputRef}
        {...rest}
      />

      {error
        && (
        <Error title={error}>
          <FiAlertCircle color="#C53030" size={20} />
        </Error>
        )}
    </Container>
  );
};

export default Input;
