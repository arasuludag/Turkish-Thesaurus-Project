import React, { useEffect } from "react";

import PropTypes from "prop-types";
import { Box, Button, styled, Tab, Tabs, Typography } from "@mui/material";
import { userOnTab, WordSearchResults } from "../search/wordSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

interface StyledTabProps {
  label: string;
}

function TabPanel(props: TabPanelProps) {
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

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 40,
    width: "100%",
    backgroundColor: "#635ee7",
  },
});

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: "none",
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  color: "rgba(255, 255, 255, 0.7)",
  "&.Mui-selected": {
    color: "#fff",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 95, 228, 0.32)",
  },
}));

export default function CustomizedTabs(props: {
  searchResult: WordSearchResults;
}) {
  const [value, setValue] = React.useState(0);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(userOnTab({ index: value }));
  }, [dispatch, value]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function ImportedWords(
    index: number,
    title: string,
    backgroundColor: string,
    words: string[]
  ) {
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

  //   function ImportedGeneratedWords(
  //     index: number, title: string, backgroundColor: string, words: string[],
  //       tabWords: string[]
  //   ) {
  //     if (words === undefined || index !== 0) return null;
  //     else
  //       return words.map((word) => {
  //         var duplicate = false;
  //         for (var enteredWord of tabWords)
  //           if (enteredWord === word) duplicate = true;
  //           else
  //             return (
  //               <Button
  //                 key={word + index}
  //                 title={title}
  //                 variant="contained"
  //                 style={{
  //                   boxShadow: "0 0 0 2pt white",
  //                   marginRight: "15px",
  //                   marginBottom: "15px",
  //                   backgroundColor: backgroundColor,
  //                   color: "white",
  //                   borderRadius: "10px",
  //                 }}
  //                 onClick={() => handleSubmit(word)}
  //               >
  //                 {word}
  //               </Button>
  //             );
  //       });
  //   }

  const navigate = useNavigate();
  const handleSubmit = (word: string) => {
    setValue(0);
    const path = "/ara/" + word;
    navigate(path);
  };

  function Words() {
    return props.searchResult.tabs.map((tab, index) => {
      return (
        <TabPanel key={index} value={value} index={index}>
          {ImportedWords(
            index,
            `Eş Anlamlı Kelime`,
            `#7BC17E`,
            props.searchResult.tabs[index].thesaurus
          )}

          {ImportedWords(
            index,
            `Benzer Anlamlı Kelime`,
            `#D0C212`,
            props.searchResult.tabs[index].similar
          )}

          {ImportedWords(
            index,
            `Zıt Anlamlı Kelime`,
            `#C93030`,
            props.searchResult.tabs[index].antonymous
          )}
        </TabPanel>
      );
    });
  }

  function TabsThemselves() {
    return props.searchResult.tabs.map((tab, index) => {
      var label;
      if (tab.clause) label = `(${tab.clause}) ${tab.name}`;
      else label = tab.name;
      return <StyledTab key={index} label={label} />;
    });
  }

  function ImportedTabs() {
    if (!props.searchResult.tabs) return null;
    else
      return (
        <div>
          <StyledTabs value={value} onChange={handleChange}>
            {TabsThemselves()}
          </StyledTabs>
          {Words()}
        </div>
      );
  }

  return <div>{ImportedTabs()}</div>;
}
