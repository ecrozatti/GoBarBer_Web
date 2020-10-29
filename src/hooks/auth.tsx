import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface User {
   id: string;
   name: string;
   email: string;
   avatar_url: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string
}

interface AuthContextData {
    user: User;
    signIn(credentials: SignInCredentials): Promise<void>;
    signOut(): void;
    updateUser(user: User): void;
}

// ({} as AuthContextData) -> uma forma de passar um objeto vazio
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  // isso só será carregado de o usuário der um refresh, sair e voltar, etc
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    if (token && user) {
      // padroniza TODAS as requisicoes feitas
      // criando um HEADER e passando um AUTHORIZATION com o valor BEARER TOken logado
      // usado tbm abaixo no SIGNIN
      api.defaults.headers.authorization = `Bearer ${token}`;

      // no set usamos stringfy, no get usamos PARSE.
      return { token, user: JSON.parse(user) };
    }

    // retorna um objeto nulo, forçando a tipagem
    return {} as AuthState;
  });

  // metodo ASYNC sempre retorna uma PROMISE
  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;
    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));

    // padroniza TODAS as requisicoes feitas
    // criando um HEADER e passando um AUTHORIZATION com o valor BEARER TOken logado
    // usado tbm acima no useSate para ser recarregado a cada F5 da pagina
    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');
    setData({} as AuthState);
  }, []);

  const updateUser = useCallback((user: User) => {
     localStorage.setItem('@GoBarber:user', JSON.stringify(user));

     setData({
       token: data.token,
       user,
     });
   }, [setData, data.token]);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}


// export { AuthContext, AuthProvider, useAuth }
// AuthContext deixa de ser usado externamente
export { AuthProvider, useAuth };
