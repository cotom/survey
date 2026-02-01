import { Trash2, GripVertical, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Textarea, Select } from '../ui/Input';

const questionTypes = [
  { value: 'text', label: 'Text Answer' },
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'rating', label: 'Rating Scale' },
  { value: 'dropdown', label: 'Dropdown' },
];

export function QuestionBuilder({ question, index, onChange, onDelete }) {
  const handleChange = (field, value) => {
    onChange(index, { ...question, [field]: value });
  };

  const handleOptionChange = (optIndex, value) => {
    const newOptions = [...(question.options || [])];
    newOptions[optIndex] = value;
    handleChange('options', newOptions);
  };

  const addOption = () => {
    const newOptions = [...(question.options || []), ''];
    handleChange('options', newOptions);
  };

  const removeOption = (optIndex) => {
    const newOptions = (question.options || []).filter((_, i) => i !== optIndex);
    handleChange('options', newOptions);
  };

  const needsOptions = ['multiple_choice', 'checkbox', 'dropdown'].includes(question.type);
  const isRating = question.type === 'rating';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-start gap-3">
        <div className="cursor-move text-gray-400 pt-2">
          <GripVertical className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                label={`Question ${index + 1}`}
                value={question.text}
                onChange={(e) => handleChange('text', e.target.value)}
                placeholder="Enter your question"
              />
            </div>
            <div className="w-48">
              <Select
                label="Type"
                value={question.type}
                onChange={(e) => handleChange('type', e.target.value)}
                options={questionTypes}
              />
            </div>
          </div>

          {needsOptions && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Options</label>
              {(question.options || []).map((option, optIndex) => (
                <div key={optIndex} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(optIndex, e.target.value)}
                    placeholder={`Option ${optIndex + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(optIndex)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="secondary" size="sm" onClick={addOption}>
                <Plus className="w-4 h-4 mr-1" /> Add Option
              </Button>
            </div>
          )}

          {isRating && (
            <div className="flex gap-4">
              <div className="w-32">
                <Input
                  label="Min"
                  type="number"
                  value={question.min_rating || 1}
                  onChange={(e) => handleChange('min_rating', parseInt(e.target.value))}
                />
              </div>
              <div className="w-32">
                <Input
                  label="Max"
                  type="number"
                  value={question.max_rating || 5}
                  onChange={(e) => handleChange('max_rating', parseInt(e.target.value))}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={question.required || false}
                onChange={(e) => handleChange('required', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Required
            </label>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onDelete(index)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
