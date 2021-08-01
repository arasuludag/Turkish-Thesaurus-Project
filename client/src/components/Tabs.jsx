import React from "react";
import { useHistory } from "react-router-dom";

import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import EditorPanel from "./EditorPanel.jsx";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      maxWidth: 40,
      width: "100%",
      backgroundColor: "#650073",
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    color: "#fff",
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    "&:focus": {
      opacity: 1,
    },
  },
}))((props) => <Tab disableRipple {...props} />);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  padding: {
    padding: theme.spacing(3),
  },
}));

export default function CustomizedTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function ImportedWords(index, title, backgroundColor, words) {
    if (words === undefined) return null;
    else
      return words.map((word) => {
        return (
          <Button
            key={word + index}
            title={title}
            variant="contained"
            style={{
              marginRight: "15px",
              marginBottom: "15px",
              backgroundColor: backgroundColor,
              color: "white",
              borderRadius: "10px",
            }}
            onClick={() => handleSubmit(word)}
          >
            {word}
          </Button>
        );
      });
  }

  function ImportedGeneratedWords(index, title, backgroundColor, words, tabWords) {
    if (words === undefined || index !== 0) return null;
    else
      return words.map((word) => {
        var duplicate = false;
        for(var enteredWord of tabWords)
        if (enteredWord === word) duplicate = true;
        else
          return (
            <Button
              key={word + index}
              title={title}
              variant="contained"
              style={{
                boxShadow: "0 0 0 2pt white",
                marginRight: "15px",
                marginBottom: "15px",
                backgroundColor: backgroundColor,
                color: "white",
                borderRadius: "10px",
              }}
              onClick={() => handleSubmit(word)}
            >
              {word}
            </Button>
          );
      });
  }

  const history = useHistory();
  const handleSubmit = (word) => {
    setValue(0);
    history.push("/ara/" + word);
  };

  function Words() {
    return props.tabData.map((tab, index) => {
      return (
        <TabPanel key={index} value={value} index={index}>
          {ImportedWords(index, `Eş Anlamlı Kelime`, `#7BC17E`, props.tabData[index].thesaurus)}
          {ImportedGeneratedWords(index, `Eş Anlamlı Kelime (Bilgisayar Önerisi)
              Uyarı: Doğruluğu tartışmalı olabilir.`, `#7BC17E`, props.genWords.thesaurus, props.tabData[index].thesaurus)}
          {ImportedWords(index, `Benzer Anlamlı Kelime`, `#D0C212`, props.tabData[index].similar)}
          {ImportedGeneratedWords(index, `Benzer Anlamlı Kelime (Bilgisayar Önerisi)
              Uyarı: Doğruluğu tartışmalı olabili r.`, `#D0C212`, props.genWords.similar, props.tabData[index].similar)}
          {ImportedWords(index, `Zıt Anlamlı Kelime`, `#C93030`, props.tabData[index].antonymous)}
          {ImportedGeneratedWords(index, `Zıt Anlamlı Kelime (Bilgisayar Önerisi)
              Uyarı: Doğruluğu tartışmalı olabilir.`, `#C93030`, props.genWords.antonymous, props.tabData[index].antonymous)}
         
        </TabPanel>
      );
    });
  }

  function TabsThemselves() {
    return props.tabData.map((tab, index) => {
      var label;
      if (tab.clause) label = `(${tab.clause}) ${tab.name}`;
      else label = tab.name;
      return <StyledTab key={index} label={label} />;
    });
  }

  function ImportedTabs() {
    if (
      props.tabData === undefined ||
      props.tabData === false ||
      props.tabData === "" ||
      props.tabData === "Nope"
    )
      return (
        <SkeletonTheme color="#2A323D" highlightColor="#222831">
          <Skeleton height={200} count={1} />
        </SkeletonTheme>
      );
    else
      return (
        <div className={classes.demo2}>
          <StyledTabs value={value} onChange={handleChange}>
            {TabsThemselves()}
          </StyledTabs>
          {Words()}
        </div>
      );
  }

  return (
    <div className={classes.root}>
      {ImportedTabs()}

      <EditorPanel
        tabData={props.tabData}
        value={value}
        wordData={props.wordData}
      />
    </div>
  );
}
