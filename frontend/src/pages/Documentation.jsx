import { useState } from 'react';
import { ChevronDown, ChevronRight, PlusCircle, Share2, BarChart3, FileText, CheckSquare, Star, List } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

const sections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: FileText,
    content: `
      Welcome to SurveyApp! This application allows you to create, share, and analyze surveys with ease.
      
      **Quick Start:**
      1. Click "Create Survey" to build your first survey
      2. Add questions using different question types
      3. Share your survey link with respondents
      4. View results in the dashboard
    `,
  },
  {
    id: 'creating-surveys',
    title: 'Creating Surveys',
    icon: PlusCircle,
    content: `
      **To create a new survey:**
      
      1. Click the "Create Survey" button on the home page
      2. Enter a title for your survey
      3. Optionally add a description to explain the survey's purpose
      4. Add questions by clicking "Add Question"
      5. Configure each question with the appropriate type and options
      6. Mark questions as required if needed
      7. Click "Create Survey" to save
      
      **Tips:**
      - Use clear and concise question text
      - Consider the order of your questions
      - Don't make every question required unless necessary
    `,
  },
  {
    id: 'question-types',
    title: 'Question Types',
    icon: CheckSquare,
    content: `
      SurveyApp supports five different question types:
      
      **Text Answer**
      - Free-form text responses
      - Best for open-ended questions
      - Example: "What suggestions do you have?"
      
      **Multiple Choice**
      - Single selection from options
      - Best for exclusive choices
      - Example: "What is your favorite color?"
      
      **Checkbox**
      - Multiple selections allowed
      - Best for "select all that apply"
      - Example: "Which features do you use?"
      
      **Rating Scale**
      - Numeric rating (customizable range)
      - Best for satisfaction/agreement scales
      - Example: "Rate your experience (1-5)"
      
      **Dropdown**
      - Single selection from a dropdown menu
      - Best for long lists of options
      - Example: "Select your country"
    `,
  },
  {
    id: 'sharing-surveys',
    title: 'Sharing Surveys',
    icon: Share2,
    content: `
      **To share your survey:**
      
      1. Go to the home page to see your surveys
      2. Click the share icon on any survey card
      3. The share link is copied to your clipboard
      4. Send the link to your respondents
      
      **Share link features:**
      - Each survey has a unique, short share link
      - Respondents don't need an account to answer
      - Links are permanent and won't change
      
      **Distribution tips:**
      - Share via email, social media, or messaging apps
      - Embed the link in your website or blog
      - Include context about why you're collecting feedback
    `,
  },
  {
    id: 'viewing-results',
    title: 'Viewing Results',
    icon: BarChart3,
    content: `
      **To view survey results:**
      
      1. Click "Results" on any survey card
      2. View the dashboard with aggregated analytics
      
      **Dashboard features:**
      
      - **Total responses**: See how many people completed your survey
      - **Per-question analytics**: 
        - Pie charts for multiple choice/checkbox questions
        - Bar charts for rating questions
        - List view for text responses
      - **Export to CSV**: Download all responses as a spreadsheet
      
      **Understanding the data:**
      - Percentages show distribution of responses
      - Rating averages help gauge overall sentiment
      - Text responses can reveal detailed feedback
    `,
  },
  {
    id: 'faq',
    title: 'FAQ',
    icon: List,
    content: `
      **Frequently Asked Questions**
      
      **Q: Can I edit a survey after creating it?**
      A: Currently, surveys cannot be edited after creation. You can delete and recreate if needed.
      
      **Q: Is there a limit to responses?**
      A: No, there's no limit to how many responses a survey can receive.
      
      **Q: Can respondents submit multiple times?**
      A: Yes, there are no restrictions on multiple submissions.
      
      **Q: How do I delete a survey?**
      A: Click the trash icon on the survey card from the home page.
      
      **Q: Is my data secure?**
      A: Data is stored locally in your MongoDB database. No data is sent to external servers.
      
      **Q: Can I add images or videos to questions?**
      A: Not currently, but this feature may be added in future updates.
    `,
  },
];

export function Documentation() {
  const [expandedSections, setExpandedSections] = useState(['getting-started']);

  const toggleSection = (id) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const formatContent = (content) => {
    return content.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <br key={i} />;
      
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        return (
          <p key={i} className="font-semibold text-gray-900 mt-4 mb-2">
            {trimmed.slice(2, -2)}
          </p>
        );
      }
      
      if (trimmed.match(/^\d+\./)) {
        return (
          <p key={i} className="ml-4 text-gray-700">
            {trimmed}
          </p>
        );
      }
      
      if (trimmed.startsWith('- ')) {
        return (
          <p key={i} className="ml-4 text-gray-700">
            • {trimmed.slice(2)}
          </p>
        );
      }

      if (trimmed.startsWith('**Q:')) {
        return (
          <p key={i} className="font-medium text-gray-900 mt-3">
            {trimmed.replace(/\*\*/g, '')}
          </p>
        );
      }

      if (trimmed.startsWith('A:')) {
        return (
          <p key={i} className="text-gray-700 ml-4 mb-2">
            {trimmed}
          </p>
        );
      }
      
      return (
        <p key={i} className="text-gray-700">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Documentation</h1>
        <p className="text-gray-600 mt-1">Learn how to use SurveyApp effectively</p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => {
          const isExpanded = expandedSections.includes(section.id);
          const Icon = section.icon;
          
          return (
            <Card key={section.id}>
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="text-lg font-medium text-gray-900">{section.title}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {isExpanded && (
                <CardContent className="pt-0 pb-6">
                  <div className="pl-13 border-l-2 border-indigo-100 ml-5 pl-8">
                    {formatContent(section.content)}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
