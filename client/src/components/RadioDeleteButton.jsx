import React, { useState } from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

export default function RadioButtonsGroup(props) {
  const [value, setValue] = useState(0)

  function listThesaurusWords(tab) {
    if (tab.thesaurus === undefined || tab.thesaurus === "") return (<h1> </h1>);
    else
      return tab.thesaurus.map((thesaurusWord) => {
        return (
          <FormControlLabel
            value={thesaurusWord}
            name={tab._id}
            control={<Radio />}
            label={thesaurusWord}
          />
        );
      });
  }

  function listSimilarWords(tab) {
    if (tab.similar === undefined || tab.similar === "") return (<h1> </h1>);
    else
      return tab.similar.map((similarWord) => {
        return (
          <FormControlLabel
            value={similarWord}
            name={tab._id}
            control={<Radio />}
            label={similarWord}
          />
        );
      });
  }

  function listAntonymousWords(tab) {
    if (tab.antonymous === undefined || tab.antonymous === "")
      return null
    else
      return tab.antonymous.map((antonymousWord) => {
        return (
          <FormControlLabel
            value={antonymousWord}
            name={tab._id}
            control={<Radio />}
            label={antonymousWord}
          />
        );
      });
  }

  function listWords() {
    if (props.tabData === undefined || props.tabData === "" || props.tabData === null)
      return null
    else
      return props.tabData.map((tab) => {
        return (
          <RadioGroup value={value} onChange={handleChange}>
            {listThesaurusWords(tab)}
            {listSimilarWords(tab)}
            {listAntonymousWords(tab)}
            <p>---</p>
          </RadioGroup>
        );
      });
  }

  const handleChange = (event) => {
    setValue(event.target.value);
    props.deleteThis(event.target.value, event.target.name);
  };

  return <FormControl component="fieldset">{listWords()}</FormControl>;
}
