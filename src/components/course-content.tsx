"use client";

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'

const sections = [
  { 
    id: 1, 
    title: 'Week 1: AI Basics & Business Strategy', 
    lectures: 8, 
    duration: 'Self-paced',
    modules: [
      '1.1 Business Strategy',
      '1.2 Initiatives & Projects',
      '1.3 AI Today',
      '1.4 Fundamentals of AI',
      '1.5 Types of AI',
      '1.6 AI Lifecycle',
      '1.7 Mindmap',
      '1.8 AI Maturity Model',
    ]
  },
  { 
    id: 2, 
    title: 'Week 2: Operating Model for AI & Key Terms', 
    lectures: 11, 
    duration: 'Self-paced',
    modules: [
      '2.1 AI Structure & Operating Model',
      '2.2 Data & AI',
      '2.3 Architecture & Platform',
      '2.4 Enterprise Work Groups',
      '2.5 Deep Learning vs. Machine Learning',
      '2.6 Supervised Learning',
      '2.7 Unsupervised Learning',
      '2.8 Transfer Learning',
      '2.9 TensorFlow',
      '2.10 Reinforcement Learning',
      '2.11 Neural Network',
    ]
  },
  { 
    id: 3, 
    title: 'Week 3: AI Future State', 
    lectures: 4, 
    duration: 'Self-paced',
    modules: [
      '3.1 AI Future',
      '3.2 Disruption',
      '3.3 Risks & Opportunities',
      '3.4 Business Outcomes',
    ]
  },
]

export default function CourseContent() {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set())

  const toggleSection = (id: number) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedSections(newExpanded)
  }

  const totalLectures = sections.reduce((sum, s) => sum + s.lectures, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Course content</h2>
        <Button variant="link" className="text-primary">
          Expand all sections
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground">
        {sections.length} sections • {totalLectures} lectures • Self-paced
      </p>

      <div className="border rounded-lg overflow-hidden">
        {sections.map((section) => (
          <div key={section.id} className="border-b last:border-b-0">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {expandedSections.has(section.id) ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
                <span className="font-semibold text-left">{section.title}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {section.lectures} lectures • {section.duration}
              </span>
            </button>
            
            {expandedSections.has(section.id) && (
              <div className="px-4 pb-4 space-y-2 bg-muted/20">
                {section.modules?.map((module, i) => (
                  <div key={i} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-muted-foreground">{module}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
