import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import { useState } from 'react';
import SummaryPage from '../pages/SummaryPage';
import LogPage from '../pages/LogPage';
import DocsPage from '../pages/DocsPage';
import { Box } from '@mui/joy';

export default function BabyTab() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  return (
    <>
      <Box display="flex">
        <Tabs
          onChange={handleChange}
          aria-label="tabs"
          defaultValue={0}
          sx={{ pt: 3, bgcolor: 'transparent' }}>
          <TabList
            disableUnderline
            sx={{
              p: 0.5,
              gap: 0.5,
              borderRadius: 'xl',
              bgcolor: 'background.level1',
              [`& .${tabClasses.root}[aria-selected="true"]`]: {
                boxShadow: 'sm',
                bgcolor: 'background.surface'
              }
            }}>
            <Tab disableIndicator>Summary</Tab>
            <Tab disableIndicator>Log</Tab>
            <Tab disableIndicator>Docs</Tab>
          </TabList>
        </Tabs>
      </Box>
      <Box>
        {activeTab === 0 && <SummaryPage />}
        {activeTab === 1 && <LogPage />}
        {activeTab === 2 && <DocsPage />}
      </Box>
    </>
  );
}
