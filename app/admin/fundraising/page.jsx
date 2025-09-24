"use client"

import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { createCampaign, listCampaigns } from '../../../lib/fundraising.js';

export default function AdminFundraisingPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [campaigns, setCampaigns] = useState(listCampaigns());
  const totalRaised = useMemo(() => campaigns.reduce((s, c) => s + (Number(c.raised) || 0), 0), [campaigns]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim() || !goal) return;
    const newCampaign = createCampaign({ title: title.trim(), description: description.trim(), goal: Number(goal) || 0 });
    setCampaigns((prev) => [newCampaign, ...prev]);
    setTitle('');
    setDescription('');
    setGoal('');
  };

  return (
    <DashboardLayout userRole="admin" title="Fundraising">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Create Campaign</CardTitle>
                <CardDescription>Start a new fundraising initiative</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid gap-4 max-w-xl">
              <Input placeholder="Campaign title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Textarea rows={4} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              <Input type="number" min="0" placeholder="Goal amount (₹)" value={goal} onChange={(e) => setGoal(e.target.value)} />
              <Button type="submit">Create campaign</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Campaigns</CardTitle>
                <CardDescription>Total raised: ₹{totalRaised.toLocaleString()}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((c) => (
                <Card key={c.id}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{c.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{c.description || 'No description provided.'}</p>
                    <Progress value={Math.min(100, (c.raised / (c.goal || 1)) * 100)} className="mb-2" />
                    <div className="text-sm">₹{(c.raised || 0).toLocaleString()} raised of ₹{(c.goal || 0).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground mt-1">Donations: {c.donations.length}</div>
                  </CardContent>
                </Card>
              ))}
              {campaigns.length === 0 && (
                <div className="text-muted-foreground">No campaigns yet. Create one above.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}


