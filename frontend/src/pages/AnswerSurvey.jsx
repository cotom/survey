import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { QuestionRenderer } from '../components/survey/QuestionRenderer';
import { surveyApi } from '../services/api';

export function AnswerSurvey() {
  const { shareId } = useParams();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        setLoading(true);
        const data = await surveyApi.getSurveyByShareId(shareId);
        setSurvey(data);
      } catch {
        setError('Survey not found');
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [shareId]);


  const handleAnswerChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
    if (errors[questionId]) {
      setErrors({ ...errors, [questionId]: null });
    }
  };

  const validateAnswers = () => {
    const newErrors = {};
    for (const question of survey.questions) {
      if (question.required) {
        const answer = answers[question.id];
        if (answer === undefined || answer === '' || (Array.isArray(answer) && answer.length === 0)) {
          newErrors[question.id] = 'This question is required';
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAnswers()) {
      return;
    }

    try {
      setSubmitting(true);
      const answersList = Object.entries(answers).map(([questionId, value]) => ({
        question_id: questionId,
        value,
      }));
      await surveyApi.submitResponse(survey.id, answersList);
      setSubmitted(true);
    } catch {
      setError('Failed to submit response. Please try again.');
    } finally {
      setSubmitting(false);
    }
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
      <div className="max-w-2xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link to="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">Your response has been recorded.</p>
            <Link to="/">
              <Button variant="secondary">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">{survey.title}</h1>
          {survey.description && (
            <p className="text-gray-600 mt-2">{survey.description}</p>
          )}
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-6">
          {survey.questions.map((question) => (
            <QuestionRenderer
              key={question.id}
              question={question}
              value={answers[question.id]}
              onChange={(value) => handleAnswerChange(question.id, value)}
              error={errors[question.id]}
            />
          ))}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={submitting} size="lg">
            {submitting ? 'Submitting...' : 'Submit Response'}
          </Button>
        </div>
      </form>
    </div>
  );
}
