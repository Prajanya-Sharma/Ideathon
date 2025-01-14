"use client";
import { useEffect, useState } from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
}

const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted((value) => !value);
  }, []);
  if (!hasMounted) {
    return null;
  }
  return <div>{children}</div>;
};

export default ClientOnly;