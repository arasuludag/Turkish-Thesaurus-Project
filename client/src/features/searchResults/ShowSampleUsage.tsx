import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAppSelector } from "../../app/hooks";
import { selectWordResults } from "../search/wordSlice";
import { Card, CardContent, Stack, Typography } from "@mui/material";

function ShowSampleUsage() {
  const searchResult = useAppSelector(selectWordResults);
  const [usage, setUsage] = useState([]);

  useEffect(() => {
    axios.get("/api/sample_usage/" + searchResult.word).then((res) => {
      setUsage(res.data);
    });
  }, [searchResult.word]);

  function List() {
    return usage.map(
      (sample: { Soz: string; Tip: string; Anlam: string }, index) => {
        return (
          <Card key={index}>
            <CardContent>
              <Typography
                title={"Otomatik oluşturulmuştur. \n Yanlışlıklar olabilir."}
              >
                {sample.Soz}
              </Typography>
              <Typography variant="caption">
                <i>{sample.Tip}</i>
              </Typography>

              <Typography variant="body2">{sample.Anlam}</Typography>
            </CardContent>
          </Card>
        );
      }
    );
  }

  return <Stack spacing={2}>{List()}</Stack>;
}

export default ShowSampleUsage;
