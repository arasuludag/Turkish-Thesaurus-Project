import React, { useState, useEffect } from "react";
import axios from "axios";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import Paper from "@material-ui/core/Paper";

function ShowSampleUsage(props) {
  const [usage, setUsage] = useState([]);

  useEffect(() => {
    axios
      .post("/api/get-sample-usage", { word: props.wordData.word })
      .then((res) => {
        setUsage(res.data);
      });
  }, [props.wordData.word]);

  function List() {
    if (usage !== undefined) {
      return usage.map((sample) => {
        return (
          <Paper key={sample.Soz} elevation={3} className="smoothbackground">
            <h2
              title={
                "Otomatik oluşturulmuştur. \n Küçük yanlışlıklar olabilir."
              }
            >
              {sample.Soz}
            </h2>
            <p>
              <i>{sample.Tip}</i>
            </p>
            <p>{sample.Anlam}</p>
            <br />
          </Paper>
        );
      });
    } else
      return (
        <SkeletonTheme color="#2A323D" highlightColor="#222831">
          <Skeleton height={200} count={1} />
        </SkeletonTheme>
      );
  }

  return <div>{List()}</div>;
}

export default ShowSampleUsage;
