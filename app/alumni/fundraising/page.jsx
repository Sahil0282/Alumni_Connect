"use client"

import React, { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { listCampaigns, contributeToCampaign } from '../../../lib/fundraising.js';

export default function AlumniFundraisingPage() {
  const [campaigns, setCampaigns] = useState(listCampaigns());
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const totalRaised = useMemo(() => campaigns.reduce((s, c) => s + (Number(c.raised) || 0), 0), [campaigns]);

  const handleContribute = (e) => {
    e.preventDefault();
    if (!selected || !amount) return;
    const updated = contributeToCampaign({ campaignId: selected, amount: Number(amount) || 0, donorName: name.trim(), message: note.trim() });
    if (updated) {
      setCampaigns(listCampaigns());
      setAmount('');
      setName('');
      setNote('');
    }
  };

  return (
    <DashboardLayout userRole="alumni" title="Fundraising">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Campaigns</CardTitle>
                <CardDescription>Total raised: ₹{totalRaised.toLocaleString()}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
              {campaigns.map((c) => (
                <label key={c.id} className={`border rounded-lg p-4 bg-card shadow-sm cursor-pointer ${selected === c.id ? 'ring-2 ring-teal-500' : ''}`}>
                  <input type="radio" name="campaign" className="hidden" value={c.id} onChange={() => setSelected(c.id)} />
                  <h2 className="font-semibold text-lg">{c.title}</h2>
                  <p className="text-sm text-muted-foreground mb-2">{c.description || 'No description provided.'}</p>
                  <Progress value={Math.min(100, (c.raised / (c.goal || 1)) * 100)} className="mb-2" />
                  <div className="text-sm">₹{(c.raised || 0).toLocaleString()} raised of ₹{(c.goal || 0).toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">Donations: {c.donations.length}</div>
                </label>
              ))}
              {campaigns.length === 0 && (
                <div className="text-muted-foreground">No active campaigns yet. Please check back soon.</div>
              )}
            </div>

            <form onSubmit={handleContribute} className="grid gap-3 max-w-xl">
              <Input placeholder="Your name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
              <Input type="number" min="1" placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <Textarea rows={3} placeholder="Message (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
              <Button type="submit" disabled={!selected || !amount}>Contribute</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}


