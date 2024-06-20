import { FC, useMemo } from "react";

import styles from "./App.module.scss";
import { CodingChallenge } from "components";

import mockupData from "constants/mock.json";
import { OptionData } from "types";

const App: FC = () => {
  const optionsData: OptionData[] = useMemo(
    () => mockupData as OptionData[],
    [mockupData]
  );

  return (
    <div className={styles.container}>
      <CodingChallenge optionsData={optionsData} />
    </div>
  );
};

export default App;
