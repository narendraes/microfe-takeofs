import Link from 'next/link'

export default function OFJiraAccess() {
  return (
    <main className="container mx-auto px-4 py-8 prose prose-slate max-w-none">
      <Link 
        href="/" 
        className="inline-flex items-center mb-8 text-sm hover:text-primary no-underline"
      >
        ← Back to Home
      </Link>
      
      <h1>OF Jira Access Guide</h1>
      
      <h2>Steps to Get OF Jira Access</h2>
      <ol className="list-decimal pl-6">
        <li className="mb-4">
          <strong>Submit Access Request</strong>
          <ul className="list-disc pl-6 mt-2">
            <li>Go to the IT Service Portal</li>
            <li>Search for "Jira Access Request"</li>
            <li>Fill out the required information</li>
          </ul>
        </li>
        
        <li className="mb-4">
          <strong>Specify Project Access</strong>
          <ul className="list-disc pl-6 mt-2">
            <li>Request access to "OF Project"</li>
            <li>Provide business justification</li>
            <li>Include your manager's name</li>
          </ul>
        </li>
        
        <li className="mb-4">
          <strong>Wait for Approval</strong>
          <ul className="list-disc pl-6 mt-2">
            <li>Your manager will receive an approval request</li>
            <li>IT team will process the request</li>
            <li>You'll receive confirmation email</li>
          </ul>
        </li>
      </ol>

      <h2>Important Notes</h2>
      <ul className="list-disc pl-6">
        <li>Access requests typically take 1-2 business days to process</li>
        <li>Make sure your manager is aware of your request</li>
        <li>Keep your confirmation email for future reference</li>
      </ul>

      <h2>Need Help?</h2>
      <p>
        If you encounter any issues, please contact{' '}
        <Link href="/support" className="text-primary hover:underline">
          IT Support
        </Link>
      </p>
    </main>
  )
} 