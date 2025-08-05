import style from "@/styles/Nav.module.css"
import { ToastProvider } from "./ToastProvider";
export default function NavBar({ children }: any) {
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
