import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CourseHeader from '../components/course-header'
import CourseContent from '../components/course-content'
import CourseSidebar from '../components/course-sidebar'
import CourseDetails from '../components/course-details'

export default function CourseListingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-[11.11vh]">
        <CourseHeader />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <CourseDetails />
              <CourseContent />
            </div>
            <div className="lg:col-span-1">
              <CourseSidebar />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

