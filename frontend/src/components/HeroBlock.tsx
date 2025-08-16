import type { FC } from "react";
import styles from "./HeroBlock.module.css";

const HeroBlock: FC = () => {
  return (
    <section className={styles.heroBlock}>
      <h1 className={styles.title}>
        NodeJS Frameworks Benchmarking&nbsp;Results
      </h1>
      <p className={styles.subTitle}>
        Gain insights into request performance, latency, CPU, and memory usage -
        all visualized in one clean page.
      </p>
      <a className={styles.seeButton} href="#results">
        See results
      </a>
    </section>
  );
};

export default HeroBlock;
