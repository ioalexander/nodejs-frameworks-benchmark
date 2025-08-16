import { ReactNode } from "react";
import styles from "./Layout.module.css";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>NodeJS Frameworks Benchmark</h2>
      </header>
      <div className={styles.container}>
        <main className={styles.childrenContainer}>{children}</main>
      </div>
      <footer className={styles.footer}>
        <p>NodeJS Frameworks Benchmark</p>
      </footer>
    </div>
  );
};

export default Layout;
