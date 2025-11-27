import React from "react";

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div>
      <header>
        <h2>SwipeBook - Main</h2>
      </header>
      <main>{children}</main>
    </div>
  );
};
