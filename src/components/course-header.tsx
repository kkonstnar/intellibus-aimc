import { Badge } from './ui/badge'
import { Star } from 'lucide-react'

export default function CourseHeader() {
  return (
    <div 
      className="relative border-b bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(/course-header.jpeg)',
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="relative container mx-auto px-4 py-8 max-w-7xl z-10">
        
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-balance text-white">
            AI Masterclass — Executive Foundations (Free Online)
          </h1>
          
          <p className="text-lg text-slate-200 leading-relaxed max-w-3xl">
            Lead AI with confidence—clear strategy, governance, and risk frameworks for senior leaders who turn direction into results, without technical overload
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100 border-0">Bestseller</Badge>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <span className="text-lg font-bold text-amber-500 mr-1">4.7</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
              </div>
              <span className="text-sm text-slate-300">(21,115 ratings)</span>
            </div>
            
            <span className="text-sm text-slate-300">12,450 learners</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-slate-300">
            <span>Presented by <span className="text-white font-medium">NYU SPS</span> and <span className="text-white font-medium">Intellibus</span></span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-slate-300">
            <span>Last updated 11/2025</span>
            <span>English [Auto], Arabic [Auto], +15 more</span>
          </div>
        </div>
      </div>
    </div>
  )
}
