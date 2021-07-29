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
      return null;
    else
      return tab.thesaurus.map((thesaurusWord, i) => {
        return (<FormControlLabel value={thesaurusWord} control={<Radio />} label={i+1 + '. ' + thesaurusWord} onChange={e => onSelect(thesaurusWord, "Thesaurus", tab._id)}/>);
      });
    }

  function listSimilarWords(tab) {
    if (tab.similar === undefined || tab.similar === "")
      return null;
    else
      return tab.similar.map((similarWord, i) => {
        return (<FormControlLabel value={similarWord} control={<Radio />} label={i+1 + '. ' + similarWord} onChange={e => onSelect(similarWord, "Similar", tab._id)}/>);
      });
    }

  function listAntonymousWords(tab) {
    if (tab.antonymous === undefined || tab.antonymous === "")
      return null
    else
      return tab.antonymous.map((antonymousWord, i) => {
        return (<FormControlLabel value={antonymousWord} control={<Radio />} label={i+1 + '. ' + antonymousWord} onChange={e => onSelect(antonymousWord, "Antonymous", tab._id)}/>);
      });
    }

  function listWords() {
    if (props.tabData === undefined || props.tabData === "" || props.tabData === null)
      return null
    else
      return props.tabData.map((tab, i) => {
        return (<RadioGroup>
          <h3>Sekme {i+1}</h3>
          <p>Eş Anlamlı:</p>
          {listThesaurusWords(tab)}
          <p>Benzer:</p>
          {listSimilarWords(tab)}
          <p>Zıt:</p>
          {listAntonymousWords(tab)}
        </RadioGroup>);
      });
    }

  return <FormControl component="fieldset">{listWords()}</FormControl>;
}
