import type { FC } from "react";
import styles from "./DownloadBlock.module.css";
import resultsData from "./../../output/results.json";

const DownloadBlock: FC = () => {
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();

    const fileData = JSON.stringify(resultsData, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "results.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <section className={styles.downloadBlock}>
      <h2 className={styles.title}>Download</h2>
      <div className={styles.row}>
        <a className={styles.download} href="#" onClick={handleDownload}>
          Download .json
        </a>
        <a
          className={styles.github}
          href="https://github.com/ioalexander/nodejs-frameworks-benchmark"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </section>
  );
};

export default DownloadBlock;
