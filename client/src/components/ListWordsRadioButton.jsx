import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

export default function RadioButtonsGroup(props) {

  const onSelect = (word, type, tabId) => {
    props.deleteThis(word, type, tabId);
  };

  function Words(tabId, tabWords, type) {
    if (tabWords === undefined || tabWords === "")
      return null;
    else
      return tabWords.map((word, i) => {
        return (<FormControlLabel value={word} control={<Radio />} label={`${i+1}. ${word}`} onChange={e => onSelect(word, type, tabId)}/>);
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
          {Words(tab._id, tab.thesaurus, `Thesaurus`)}
          <p>Benzer:</p>
          {Words(tab._id, tab.similar, `Similar`)}
          <p>Zıt:</p>
          {Words(tab._id, tab.antonymous, `Antonymous`)}
        </RadioGroup>);
      });
    }

  return <FormControl component="fieldset">{listWords()}</FormControl>;
}
