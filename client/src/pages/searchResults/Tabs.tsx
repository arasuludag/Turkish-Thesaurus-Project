import PropTypes from "prop-types";
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import {
  selectCurrentTabIndex,
  userOnTab,
  WordSearchResults,
} from "../../slices/wordSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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

export default function CustomizedTabs(props: {
  searchResult: WordSearchResults;
}) {
  const dispatch = useAppDispatch();
  const tabIndex = useAppSelector(selectCurrentTabIndex);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    dispatch(userOnTab({ index: newValue }));
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
            sx={{
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
    dispatch(userOnTab({ index: 0 }));
    const path = "/ara/" + word;
    navigate(path);
  };

  function Words() {
    return props.searchResult.tabs.map((tab, index) => {
      return (
        <TabPanel key={index} value={tabIndex} index={index}>
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
      return <Tab key={index} label={label} />;
    });
  }

  function ImportedTabs() {
    if (!props.searchResult.tabs) return null;
    else
      return (
        <div>
          <Tabs value={tabIndex} onChange={handleChange}>
            {TabsThemselves()}
          </Tabs>
          {Words()}
        </div>
      );
  }

  return <div>{ImportedTabs()}</div>;
}
