'use client';

import { useEffect, useState } from 'react';
import * as microsoftTeams from '@microsoft/teams-js';

/**
 * Teams Tab Configuration Page
 * This page is shown when a user adds the app to a Team channel
 */
export default function TeamsConfigPage() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function initTeams() {
      try {
        await microsoftTeams.app.initialize();
        setIsInitialized(true);

        // Register save handler
        microsoftTeams.pages.config.registerOnSaveHandler((saveEvent) => {
          microsoftTeams.pages.config.setConfig({
            suggestedDisplayName: 'Planify',
            entityId: 'planify-tab',
            contentUrl: `${window.location.origin}/?inTeams=true`,
            websiteUrl: window.location.origin,
          });
          saveEvent.notifySuccess();
        });

        // Enable save button
        microsoftTeams.pages.config.setValidityState(true);
      } catch (error) {
        console.error('Failed to initialize Teams:', error);
      }
    }

    initTeams();
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-secondary">
        <div className="text-text-tertiary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary p-6">
      <div className="max-w-md mx-auto">
        <div className="bg-bg-primary rounded-2xl border border-border-primary p-6 shadow-sm">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
              <svg className="h-7 w-7 text-accent-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary">Planify</h1>
              <p className="text-sm text-text-tertiary">Project Planning & Kanban</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Add Planify to this channel to help your team:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-text-secondary">
                <svg className="h-5 w-5 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Plan projects with interactive Gantt charts
              </li>
              <li className="flex items-start gap-2 text-sm text-text-secondary">
                <svg className="h-5 w-5 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Manage tasks with Kanban boards
              </li>
              <li className="flex items-start gap-2 text-sm text-text-secondary">
                <svg className="h-5 w-5 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Track progress with subtasks
              </li>
              <li className="flex items-start gap-2 text-sm text-text-secondary">
                <svg className="h-5 w-5 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Collaborate in real-time
              </li>
            </ul>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-bg-tertiary rounded-xl">
            <p className="text-xs text-text-tertiary">
              Click <strong className="text-text-secondary">Save</strong> to add Planify to this channel.
              Team members will be able to access it from the channel tabs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
