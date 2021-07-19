import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

export default function RadioButtonsGroup({props}) {
  const [value, setValue] = React.useState('thesaurus');
  props(value);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <FormControl component="fieldset">
      <RadioGroup value={value} onChange={handleChange}>
        <FormControlLabel value="thesaurus" control={<Radio />} label="Eş Anlamlı" />
        <FormControlLabel value="similar" control={<Radio />} label="Benzer" />
        <FormControlLabel value="antonymous" control={<Radio />} label="Zıt Anlamlı" />
      </RadioGroup>
    </FormControl>
  );
}
