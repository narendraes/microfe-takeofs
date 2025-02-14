import Link from 'next/link'

export default function IdeaContributorAccess() {
  return (
    <main className="container mx-auto px-4 py-8 prose prose-slate max-w-none">
      <Link 
        href="/" 
        className="inline-flex items-center mb-8 text-sm hover:text-primary no-underline"
      >
        ← Back to Home
      </Link>
      
      <h1>Idea Contributor Access Guide</h1>
      
      <h2>How to Get Started</h2>
      <ol className="list-decimal pl-6">
        <li className="mb-4">
          <strong>Request Access</strong>
          <ul className="list-disc pl-6 mt-2">
            <li>Ensure you have an active company account</li>
            <li>Verify your department permissions</li>
            <li>Complete the onboarding training</li>
          </ul>
        </li>
        
        <li className="mb-4">
          <strong>Complete Required Training</strong>
          <ul className="list-disc pl-6 mt-2">
            <li>Watch the idea submission tutorial</li>
            <li>Review the contribution guidelines</li>
            <li>Pass the brief assessment</li>
          </ul>
        </li>
        
        <li className="mb-4">
          <strong>Set Up Your Profile</strong>
          <ul className="list-disc pl-6 mt-2">
            <li>Fill in your expertise areas</li>
            <li>Set your notification preferences</li>
            <li>Connect with your team members</li>
          </ul>
        </li>
      </ol>

      <h2>Contribution Guidelines</h2>
      <ul className="list-disc pl-6">
        <li>All ideas should align with company objectives</li>
        <li>Provide detailed descriptions and potential impact</li>
        <li>Follow the idea submission template</li>
        <li>Respect confidentiality guidelines</li>
      </ul>

      <h2>Additional Resources</h2>
      <ul className="list-disc pl-6">
        <li>Idea Submission Best Practices</li>
        <li>Contribution Templates</li>
        <li>FAQ Documentation</li>
      </ul>

      <h2>Need Assistance?</h2>
      <p>
        For any questions or support, please visit our{' '}
        <Link href="/support" className="text-primary hover:underline">
          Support Page
        </Link>
      </p>
    </main>
  )
} 