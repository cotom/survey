import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { QuestionBuilder } from '../components/survey/QuestionBuilder';
import { surveyApi } from '../services/api';

const defaultQuestion = {
  text: '',
  type: 'text',
  required: false,
  options: [],
  min_rating: 1,
  max_rating: 5,
};

export function CreateSurvey() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([{ ...defaultQuestion }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const addQuestion = () => {
    setQuestions([...questions, { ...defaultQuestion }]);
  };

  const updateQuestion = (index, updatedQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const deleteQuestion = (index) => {
    if (questions.length === 1) {
      alert('Survey must have at least one question');
      return;
    }
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a survey title');
      return;
    }

    if (questions.some((q) => !q.text.trim())) {
      setError('Please fill in all question texts');
      return;
    }

    const optionTypes = ['multiple_choice', 'checkbox', 'dropdown'];
    for (const q of questions) {
      if (optionTypes.includes(q.type) && (!q.options || q.options.length < 2)) {
        setError('Questions with options need at least 2 options');
        return;
      }
    }

    try {
      setSaving(true);
      setError(null);
      const survey = await surveyApi.createSurvey({
        title,
        description,
        questions,
      });
      navigate(`/dashboard/${survey.id}`);
    } catch {
      setError('Failed to create survey. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Survey</h1>
        <p className="text-gray-600 mt-1">Design your survey with different question types</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Survey Details</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Survey Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter survey title"
              required
            />
            <Textarea
              label="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this survey is about"
              rows={3}
            />
          </CardContent>
        </Card>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Questions</h2>
            <Button type="button" variant="secondary" onClick={addQuestion}>
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>
          <div className="space-y-4">
            {questions.map((question, index) => (
              <QuestionBuilder
                key={index}
                question={question}
                index={index}
                onChange={updateQuestion}
                onDelete={deleteQuestion}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="secondary" onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Creating...' : 'Create Survey'}
          </Button>
        </div>
      </form>
    </div>
  );
}
