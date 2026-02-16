"use client";

import MemoryGame from "./components/MemoryGame";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <MemoryGame />
    </div>
  );
}
