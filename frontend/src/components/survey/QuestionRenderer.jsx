import { Input, Textarea } from '../ui/Input';

export function QuestionRenderer({ question, value, onChange, error }) {
  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer here..."
            rows={3}
          />
        );

      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {(question.options || []).map((option, index) => (
              <label key={index} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange(e.target.value)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {(question.options || []).map((option, index) => (
              <label key={index} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  checked={(value || []).includes(option)}
                  onChange={(e) => {
                    const current = value || [];
                    if (e.target.checked) {
                      onChange([...current, option]);
                    } else {
                      onChange(current.filter((v) => v !== option));
                    }
                  }}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'rating': {
        const min = question.min_rating || 1;
        const max = question.max_rating || 5;
        const ratings = Array.from({ length: max - min + 1 }, (_, i) => min + i);
        return (
          <div className="flex gap-2 flex-wrap">
            {ratings.map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => onChange(rating)}
                className={`w-12 h-12 rounded-lg border-2 font-medium transition-colors ${
                  value === rating
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-gray-300 hover:border-indigo-400'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        );
      }

      case 'dropdown':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select an option...</option>
            {(question.options || []).map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {question.text}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </h3>
      </div>
      {renderInput()}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
