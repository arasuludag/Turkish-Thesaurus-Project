import React, {useState} from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

export default function RadioButtonsGroup(props) {

  const onSelect = (word, type, tabId) => {
    props.deleteThis(word, type, tabId);
  };

  function listThesaurusWords(tab) {
    if (tab.thesaurus === undefined || tab.thesaurus === "")
      return (<h1></h1>);
    else
      return tab.thesaurus.map((thesaurusWord) => {
        return (<FormControlLabel value={thesaurusWord} control={<Radio />} label={thesaurusWord} onChange={e => onSelect(thesaurusWord, "Thesaurus", tab._id)}/>);
      });
    }

  function listSimilarWords(tab) {
    if (tab.similar === undefined || tab.similar === "")
      return (<h1></h1>);
    else
      return tab.similar.map((similarWord) => {
        return (<FormControlLabel value={similarWord} control={<Radio />} label={similarWord} onChange={e => onSelect(similarWord, "Similar", tab._id)}/>);
      });
    }

  function listAntonymousWords(tab) {
    if (tab.antonymous === undefined || tab.antonymous === "")
      return null
    else
      return tab.antonymous.map((antonymousWord) => {
        return (<FormControlLabel value={antonymousWord} control={<Radio />} label={antonymousWord} onChange={e => onSelect(antonymousWord, "Antonymous", tab._id)}/>);
      });
    }

  function listWords() {
    if (props.tabData === undefined || props.tabData === "" || props.tabData === null)
      return null
    else
      return props.tabData.map((tab) => {
        return (<RadioGroup>
          {listThesaurusWords(tab)}
          <p>-</p>
          {listSimilarWords(tab)}
          <p>-</p>
          {listAntonymousWords(tab)}
          <p>---</p>
        </RadioGroup>);
      });
    }

  return <FormControl component="fieldset">{listWords()}</FormControl>;
}
