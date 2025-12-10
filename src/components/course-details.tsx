import { Check } from 'lucide-react'
import { Badge } from './ui/badge'

const learningPoints = [
  'A clear leadership view of AI strategy, governance, and risk',
  'How to tie AI initiatives to business outcomes and accountability',
  'A simple Build · Buy · Partner operating-model checklist',
  'Responsible AI guardrails and model oversight patterns',
  'Roles and decision rights across business, risk, data, and tech',
  'A one-page AI roadmap from vision to execution',
  'Board- and regulator-ready communication and reporting',
  'Templates and steering prompts to drive cross-functional alignment',
]

const requirements = [
  'No coding or technical background required—strategic focus only',
  'An executive perspective and willingness to challenge assumptions',
]

const topics = [
  'AI Strategy',
  'AI Governance',
  'Responsible AI',
  'Model Risk',
  'Operating Model',
  'Enterprise Data Strategy',
  'Risk & Compliance',
  'Product Strategy',
  'Digital Transformation',
]

const includes = [
  '17 hours on-demand video',
  'Certificate of completion',
  'Access on mobile and TV',
  '8 strategic frameworks',
]

export default function CourseDetails() {
  return (
    <div className="space-y-8">
      {/* What you'll learn */}
      <div className="border rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {learningPoints.map((point, index) => (
            <div key={index} className="flex gap-3">
              <Check className="w-5 h-5 text-foreground flex-shrink-0 mt-0.5" />
              <span className="text-sm leading-relaxed">{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Who it's for */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Who it's for</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          A non-technical AI primer for senior leaders directing strategy, governance, and value creation.
        </p>
      </div>

      {/* Requirements */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Requirements</h2>
        <ul className="space-y-3">
          {requirements.map((req, index) => (
            <li key={index} className="flex gap-2 text-sm leading-relaxed">
              <span className="text-muted-foreground mt-2">•</span>
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Explore related topics */}
      <div>
        <h2 className="text-xl font-bold mb-4">Explore related topics</h2>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <Badge key={topic} variant="outline" className="px-4 py-2 text-sm font-normal">
              {topic}
            </Badge>
          ))}
        </div>
      </div>

      {/* This course includes */}
      <div>
        <h2 className="text-2xl font-bold mb-4">This course includes:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {includes.map((item, index) => (
            <div key={index} className="flex items-center gap-3 text-sm">
              <Check className="w-5 h-5 text-muted-foreground" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
