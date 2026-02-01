import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Copy, Check } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { surveyApi } from '../services/api';

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];

export function Dashboard() {
  const { surveyId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [survey, setSurvey] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [analyticsData, surveyData] = await Promise.all([
          surveyApi.getAnalytics(surveyId),
          surveyApi.getSurvey(surveyId),
        ]);
        setAnalytics(analyticsData);
        setSurvey(surveyData);
      } catch {
        setError('Failed to load survey data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [surveyId]);

  const copyShareLink = async () => {
    if (!survey) return;
    const link = `${window.location.origin}/s/${survey.share_id}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCSV = async () => {
    try {
      const responses = await surveyApi.getResponses(surveyId);
      if (responses.length === 0) {
        alert('No responses to export');
        return;
      }

      const headers = ['Submitted At', ...analytics.questions.map((q) => q.question_text)];
      const rows = responses.map((r) => {
        const row = [new Date(r.submitted_at).toLocaleString()];
        for (const q of analytics.questions) {
          const answer = r.answers.find((a) => a.question_id === q.question_id);
          const value = answer ? (Array.isArray(answer.value) ? answer.value.join('; ') : answer.value) : '';
          row.push(value);
        }
        return row;
      });

      const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${analytics.title}-responses.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to export responses');
    }
  };

  const renderQuestionChart = (question) => {
    const { question_type, data, total_answers } = question;

    if (total_answers === 0) {
      return <p className="text-gray-500 text-center py-8">No responses yet</p>;
    }

    if (question_type === 'text') {
      return (
        <div className="max-h-64 overflow-y-auto space-y-2">
          {data.responses.map((response, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg text-sm">
              {response}
            </div>
          ))}
        </div>
      );
    }

    if (question_type === 'rating') {
      return (
        <div>
          <div className="text-center mb-4">
            <span className="text-3xl font-bold text-indigo-600">{data.average}</span>
            <span className="text-gray-500 ml-2">average rating</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.distribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (['multiple_choice', 'checkbox', 'dropdown'].includes(question_type)) {
      const chartData = data.map((d, i) => ({
        name: d.option,
        value: d.count,
        fill: COLORS[i % COLORS.length],
      }));

      return (
        <div className="flex flex-col md:flex-row items-center gap-4">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 min-w-[150px]">
            {chartData.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="flex-1">{item.name}</span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{analytics.title}</h1>
            <p className="text-gray-600">
              {analytics.total_responses} response{analytics.total_responses !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={copyShareLink}>
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
            {copied ? 'Copied!' : 'Share'}
          </Button>
          <Button variant="secondary" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {analytics.questions.map((question, index) => (
          <Card key={question.question_id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-sm text-gray-500">Question {index + 1}</span>
                  <h3 className="text-lg font-medium text-gray-900">{question.question_text}</h3>
                </div>
                <span className="text-sm text-gray-500">
                  {question.total_answers} answer{question.total_answers !== 1 ? 's' : ''}
                </span>
              </div>
            </CardHeader>
            <CardContent>{renderQuestionChart(question)}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
