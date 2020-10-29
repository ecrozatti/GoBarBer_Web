import React from 'react';

import { Container } from './styles';

interface TooltipProps {
  title: string;
  // tem que receber a classe ro React
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ title, className, children }) => (
  <Container className={className}>
    {children}
    <span>{title}</span>
  </Container>
);

export default Tooltip;
