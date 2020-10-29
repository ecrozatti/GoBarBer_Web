import React, { useCallback, useRef } from 'react';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';

import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background, AnimationContainer } from './styles';
import api from '../../services/api';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const history = useHistory();
  
  // usado para pegar as query params na url
  const location = useLocation();

  const handleSubmit = useCallback(async (data: ResetPasswordFormData) => {
    try {
      // zera os erros
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        password: Yup.string().required('Senha obrigatória'),
        password_confirmation: Yup.string().oneOf(
           [Yup.ref('password'), undefined], 
           'Senhas diferentes'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const { password, password_confirmation } = data;

      const token = location.search.replace('?token=', '');

      if (!token) {
         throw new Error();
      }

      await api.post('/password/reset', {
         password,
         password_confirmation,
         token
      });

      addToast({
         type: 'success',
         title: 'Senha redefinida',
         description: 'Senha redefina com sucesso'
      });
      
      // redireciona para SignIn
      history.push('/');
    } catch (error) {
      // Se fizer parte dos erros de validacao do YUP
      if (error instanceof Yup.ValidationError) {
        // utiliza nossa funcao criada na pasta UTIL para montar os erros
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);
        return; // para nao continuar processando
      }

      addToast({
        type: 'error',
        title: 'Erro nao resetar senha',
        description: 'Ocorreu um erro ao resetar sua senha, tente novamente.',
      });
    }
  }, [addToast, history, location.search]);

  return (
    <Container>
      {/* Secao para armazenar os dados de login  */}
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>

            <Input name="password" icon={FiLock} placeholder="Nova senha" type="password" />
            <Input name="password_confirmation" icon={FiLock} placeholder="Confirmação da senha" type="password" />

            <Button type="submit">Alterar senha</Button>
          </Form>
        </AnimationContainer>
      </Content>

      {/* Secao para armazenar a imagem */}
      <Background />
    </Container>
  );
};

export default ResetPassword;
