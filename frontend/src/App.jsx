import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home, CreateSurvey, AnswerSurvey, Dashboard, Documentation, Planets, Random } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/s/:shareId" element={<AnswerSurvey />} />
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<CreateSurvey />} />
                <Route path="/dashboard/:surveyId" element={<Dashboard />} />
                <Route path="/docs" element={<Documentation />} />
                <Route path="/planets" element={<Planets />} />
                <Route path="/random" element={<Random />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
