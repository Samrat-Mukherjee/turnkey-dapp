// components/ActivityCard.tsx
import { ActivityRow } from "./ActivityRow";
import style from "@/styles/Activity.module.css";

interface Activity {
  send: boolean;
  date: string;
  from: string;
  to: string;
  amount: number;
}

const activities: Activity[] = [
  {
    send: true,
    date: "July 31, 2025 at 09:56 PM",
    from: "0xC58fBEADCbEe46f5B558aaeF6588eA202e383E05",
    to: "0x08d2b0a37F869FF76BACB5Bab3278E26ab7067B7",
    amount: 0.00001,
  },
  {
    send: false,
    date: "July 28, 2025 at 04:22 PM",
    from: "0x08d2b0a37F869FF76BACB5Bab3278E26ab7067B7",
    to: "0xC58fBEADCbEe46f5B558aaeF6588eA202e383E05",
    amount: 0.001,
  },
   {
    send: true,
    date: "July 31, 2025 at 03:33 PM",
    from: "0xC58fBEADCbEe46f5B558aaeF6588eA202e383E05",
    to: "0x08d2b0a37F869FF76BACB5Bab3278E26ab7067B7",
    amount: 0.00001,
  },
  {
    send: false,
    date: "July 28, 2025 at 08:22 AM",
    from: "0x08d2b0a37F869FF76BACB5Bab3278E26ab7067B7",
    to: "0xC58fBEADCbEe46f5B558aaeF6588eA202e383E05",
    amount: 0.003,
  },
   {
    send: true,
    date: "July 31, 2025 at 06:56 PM",
    from: "0xC58fBEADCbEe46f5B558aaeF6588eA202e383E05",
    to: "0x08d2b0a37F869FF76BACB5Bab3278E26ab7067B7",
    amount: 0.00004,
  },
  {
    send: false,
    date: "July 28, 2025 at 07:28 PM",
    from: "0x08d2b0a37F869FF76BACB5Bab3278E26ab7067B7",
    to: "0xC58fBEADCbEe46f5B558aaeF6588eA202e383E05",
    amount: 0.008,
  },
];

export function ActivityCard() {
  return (
    <div className={style.activityDiv}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "0.8rem",
          fontWeight: "700",
          color: "#737373",
          marginBottom: "0.5rem",
        }}
      >
        <p>Amount</p>
        <p>Date</p>
        <p>From</p>
        <p>To</p>
        
      </div>
      {/* <hr /> */}
      {activities.map((activity, index) => (
        <ActivityRow key={index} val={activity} />
      ))}
    </div>
  );
}
