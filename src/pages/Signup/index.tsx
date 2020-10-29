import React, { useCallback, useRef } from 'react';
import {
  FiArrowLeft, FiMail, FiLock, FiUser,
} from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
// importa tudo da biblioteca, chamando Yup.
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

// import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background, AnimationContainer } from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(async (data: SignUpFormData) => {
    try {
      // zera os erros
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
        password: Yup.string().min(4, 'No mínimo 4 dígitos'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await api.post('/users', data);

      // apos o cadastro, redireciona para o login
      history.push('/');

      addToast({
        type: 'success',
        title: 'Cadastro realizado!',
        description: 'Você já pode fazer seu logon no GoBarber.'
      })
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
        title: 'Erro no cadastro',
        description: 'Ocorreu um erro ao cadastrar, tente novamente.',
      });
    }
  }, [addToast, history]);

  return (
    <Container>
      {/* Secao para armazenar a imagem */}
      <Background />

      {/* Secao para armazenar os dados de login  */}
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          {/* Usamos dessa forma para setar um valor para para um INPUT */}
          {/* <Form initialData={{ name: 'Eric' }} onSubmit={handleSubmit}> */}
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu cadastro</h1>

            <Input name="name" icon={FiUser} placeholder="Nome" />
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input name="password" icon={FiLock} placeholder="Senha" type="password" />

            <Button type="submit">Cadastrar</Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            Voltar para logon
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default Signup;
