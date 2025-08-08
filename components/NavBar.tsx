import style from "@/styles/Nav.module.css";
import { ToastProvider } from "./ToastProvider";
import React from "react";
export default function NavBar({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className={style.navbar}>
        <h1>TurnWallet</h1>
        <div></div>
      </div>
      {children}
      <ToastProvider />
    </>
  );
}
