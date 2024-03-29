import React, { useCallback, useRef, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background, AnimationContainer } from './styles';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
   const [loading, setLoading] = useState(false);

  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(async (data: ForgotPasswordFormData) => {
    try {
       setLoading(true);

      // zera os erros
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await api.post('/password/forgot', {
         email: data.email,
      });

      addToast({
         type: 'success',
         title: 'Email de recuperação enviado',
         description: 'Verifique sua caixa de entrada'
      });

      // history.push('/dashboard');
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
        title: 'Erro na recuperação de senha',
        description: 'Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente.',
      });
    } finally {
       setLoading(false);
    }
  }, [addToast]);

  return (
    <Container>
      {/* Secao para armazenar os dados de login  */}
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resuperar senha</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Button loading={loading} type="submit">Recuperar</Button>
         </Form>

          <Link to="/signin">
            <FiLogIn />
            Voltar ao login
          </Link>
        </AnimationContainer>
      </Content>

      {/* Secao para armazenar a imagem */}
      <Background />
    </Container>
  );
};

export default ForgotPassword;
