import styles from "./page.module.css";
import { PrismaClient } from "@repo/db/client";

const client = new PrismaClient();

export default function Home() {
  return (
    <h1 className="text-slate-400 font-extrabold text-2xl">HI THERE</h1>
  );
}
