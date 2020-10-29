import React, { createContext, useCallback, useState, useContext } from 'react';
import { uuid } from 'uuidv4';

import ToastContainer from '../components/ToastContainer';

export interface ToastMessage {
    // forcamos a criacao de um ID, pq posteriormente usaremos a propriedade KEY,
    id: string;
    type: 'info' | 'success' | 'error';
    title: string;
    description?: string;
}

// interface SignInCredentials {
//   email: string;
//   password: string
// }

interface ToastContextData {
    addToast(message: Omit<ToastMessage, 'id'>): void;
    removeToast(id: string): void;
}

// ({} as AuthContextData) -> uma forma de passar um objeto vazio
const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({ children }) => {
    // toda vez que definirmos um array de estado, definir os tipos, criando uma interface
    const [messages, setMessages] = useState<ToastMessage[]>([]);
 
    // message eh do tipo ToastMessage, menos id (por isso o Omit)
    // const addToast = useCallback((message: Omit<ToastMessage, 'id'>) => {
    const addToast = useCallback(({ type, title, description }: Omit<ToastMessage, 'id'>) => {
        const id = uuid();

        const toast = {
            id,
            type,
            title,
            description,
        }

        // Usando nesse formato, nao precisar passar MESSAGES, no array do segundo param. (05:00 min.)
        // setMessages([...messages, toast]);
        setMessages((state) => [...state, toast]);
    }, []);
    //}, [messages]);

    const removeToast = useCallback((id: string) => {
        // retorna todas as messages, menos a com o id passado para remover
        setMessages((state) => state.filter((message) => message.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <ToastContainer messages={messages}/>
        </ToastContext.Provider>
    );
};

function useToast(): ToastContextData {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within an ToastProvider');
  }

  return context;
}

export { ToastProvider, useToast };
