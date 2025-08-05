// components/ActivityRow.tsx

import { shortenAddress } from "@/lib/utills/addressShort";

import style from "@/styles/Activity.module.css";
interface Activity {
  send: boolean;
  date: string;
  from: string;
  to: string;
  amount: number;
}

interface ActivityRowProps {
  val: Activity;
}

export function ActivityRow({ val }: ActivityRowProps) {
  const { send, date, from, to, amount } = val;

  return (
    <>
    <div className={style.activityRow}>
      <div className="text-sm">
        {send ? "Sent" : "Received"}{" "}
        <strong className="text-black">{amount} ETH</strong>
      </div>
      <div className="text-sm text-gray-500">{date}</div>
      <div className="text-sm text-gray-500">{shortenAddress(from)}</div>
      <div className="text-sm text-gray-500">{shortenAddress(to)}</div>
    </div>
    <hr/>
    </>

  );
}
