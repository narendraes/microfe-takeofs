"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function AdminPanel() {
  const [newTabName, setNewTabName] = useState("")
  const [newTabPermission, setNewTabPermission] = useState("")
  const [apiToken, setApiToken] = useState("")

  const handleAddTab = () => {
    // Here you would typically send this data to your backend
    console.log("Adding new tab:", { name: newTabName, permission: newTabPermission })
    // Reset form
    setNewTabName("")
    setNewTabPermission("")
  }

  const handleSaveApiToken = () => {
    // Here you would typically send this data to your backend
    console.log("Saving API token:", apiToken)
    // Reset form
    setApiToken("")
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
        <p className="mb-4">Manage tabs and API tokens for the application.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Add New Tab</h3>
        <div className="space-y-2">
          <Label htmlFor="newTabName">Tab Name</Label>
          <Input
            id="newTabName"
            value={newTabName}
            onChange={(e) => setNewTabName(e.target.value)}
            placeholder="Enter new tab name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="newTabPermission">Tab Permission</Label>
          <Input
            id="newTabPermission"
            value={newTabPermission}
            onChange={(e) => setNewTabPermission(e.target.value)}
            placeholder="Enter permission required for this tab"
          />
        </div>
        <Button onClick={handleAddTab}>Add Tab</Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Configure API Token</h3>
        <div className="space-y-2">
          <Label htmlFor="apiToken">API Token</Label>
          <Textarea
            id="apiToken"
            value={apiToken}
            onChange={(e) => setApiToken(e.target.value)}
            placeholder="Enter your API token"
            rows={4}
          />
        </div>
        <Button onClick={handleSaveApiToken}>Save API Token</Button>
      </div>
    </div>
  )
}

