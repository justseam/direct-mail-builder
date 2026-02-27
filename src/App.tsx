import { Routes, Route } from 'react-router-dom';
import { CampaignProvider } from './stores/CampaignStore';
import AppShell from './components/layout/AppShell';
import DirectMailList from './pages/DirectMailList';
import AudienceListPage from './pages/AudienceList';
import AudienceUpload from './pages/AudienceUpload';
import CreateDirectMail from './pages/CreateDirectMail';

export default function App() {
  return (
    <CampaignProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<DirectMailList />} />
          <Route path="templates" element={<DirectMailList initialTab="templates" />} />
          <Route path="audiences" element={<AudienceListPage />} />
        </Route>
        <Route path="audiences/upload" element={<AudienceUpload />} />
        <Route path="campaigns/new" element={<CreateDirectMail />} />
      </Routes>
    </CampaignProvider>
  );
}
