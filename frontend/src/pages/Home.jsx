import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BarChart3, Share2, Trash2, Copy, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { surveyApi } from '../services/api';

export function Home() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      setLoading(true);
      const data = await surveyApi.listSurveys();
      setSurveys(data);
    } catch {
      setError('Failed to load surveys');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this survey?')) return;
    try {
      await surveyApi.deleteSurvey(id);
      setSurveys(surveys.filter((s) => s.id !== id));
    } catch {
      alert('Failed to delete survey');
    }
  };

  const copyShareLink = async (shareId) => {
    const link = `${window.location.origin}/s/${shareId}`;
    await navigator.clipboard.writeText(link);
    setCopiedId(shareId);
    setTimeout(() => setCopiedId(null), 2000);
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
        <p className="text-red-600">{error}</p>
        <Button onClick={loadSurveys} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Surveys</h1>
          <p className="text-gray-600 mt-1">Create, manage, and analyze your surveys</p>
        </div>
        <Link to="/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Survey
          </Button>
        </Link>
      </div>

      {surveys.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No surveys yet</h3>
            <p className="text-gray-600 mb-4">Create your first survey to get started</p>
            <Link to="/create">
              <Button>Create Survey</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {surveys.map((survey) => (
            <Card key={survey.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {survey.title}
                    </h3>
                    {survey.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {survey.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>{survey.response_count} responses</span>
                  <span>•</span>
                  <span>{new Date(survey.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link to={`/dashboard/${survey.id}`} className="flex-1">
                    <Button variant="secondary" className="w-full">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Results
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyShareLink(survey.share_id)}
                    title="Copy share link"
                  >
                    {copiedId === survey.share_id ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(survey.id)}
                    title="Delete survey"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
