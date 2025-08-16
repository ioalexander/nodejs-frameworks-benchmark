import type { NextPage } from "next";
import Layout from "../components/Layout";
import HeroBlock from "../components/HeroBlock";
import ResultsBlock from "@/components/ResultsBlock";
import DownloadBlock from "@/components/DownloadBlock";

const Home: NextPage = () => {
  return (
    <Layout>
      <HeroBlock />
      <ResultsBlock />
      <DownloadBlock />
    </Layout>
  );
};

export default Home;
