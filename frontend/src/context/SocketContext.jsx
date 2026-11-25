import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext.jsx';

const Ctx = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (!user) {
      ref.current?.disconnect();
      ref.current = null;
      setSocket(null);
      return;
    }
    const token = localStorage.getItem('ba_token');
    const s = io('/', { auth: { token } });
    ref.current = s;
    setSocket(s);
    return () => { s.disconnect(); };
  }, [user]);

  return <Ctx.Provider value={{ socket }}>{children}</Ctx.Provider>;
};

export const useSocket = () => useContext(Ctx);