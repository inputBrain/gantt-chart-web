import * as microsoftTeams from '@microsoft/teams-js';

export interface TeamsContext {
  isInTeams: boolean;
  isInitialized: boolean;
  theme: 'default' | 'dark' | 'contrast';
  teamId?: string;
  channelId?: string;
  userId?: string;
  userPrincipalName?: string;
  tenantId?: string;
  locale?: string;
}

export const defaultTeamsContext: TeamsContext = {
  isInTeams: false,
  isInitialized: false,
  theme: 'default',
};

/**
 * Initialize Microsoft Teams SDK
 * Returns context if running inside Teams, null otherwise
 */
export async function initializeTeams(): Promise<TeamsContext> {
  try {
    // Check if we're in an iframe (Teams loads apps in iframes)
    if (typeof window === 'undefined') {
      return defaultTeamsContext;
    }

    // Initialize the Teams SDK
    await microsoftTeams.app.initialize();

    // Get the context
    const context = await microsoftTeams.app.getContext();

    // Map Teams theme to our theme
    const themeMap: Record<string, TeamsContext['theme']> = {
      default: 'default',
      dark: 'dark',
      contrast: 'contrast',
    };

    return {
      isInTeams: true,
      isInitialized: true,
      theme: themeMap[context.app.theme || 'default'] || 'default',
      teamId: context.team?.internalId,
      channelId: context.channel?.id,
      userId: context.user?.id,
      userPrincipalName: context.user?.userPrincipalName,
      tenantId: context.user?.tenant?.id,
      locale: context.app.locale,
    };
  } catch (error) {
    // Not running in Teams - this is expected for standalone usage
    console.log('Not running in Microsoft Teams context');
    return defaultTeamsContext;
  }
}

/**
 * Register theme change handler for Teams
 */
export function registerTeamsThemeHandler(
  onThemeChange: (theme: TeamsContext['theme']) => void
): void {
  try {
    microsoftTeams.app.registerOnThemeChangeHandler((theme) => {
      const themeMap: Record<string, TeamsContext['theme']> = {
        default: 'default',
        dark: 'dark',
        contrast: 'contrast',
      };
      onThemeChange(themeMap[theme] || 'default');
    });
  } catch {
    // Not in Teams, ignore
  }
}

/**
 * Notify Teams that the app is loaded and ready
 */
export function notifyTeamsAppLoaded(): void {
  try {
    microsoftTeams.app.notifyAppLoaded();
    microsoftTeams.app.notifySuccess();
  } catch {
    // Not in Teams, ignore
  }
}

/**
 * Get authentication token for calling backend APIs
 * This uses Teams SSO to get a token
 */
export async function getTeamsAuthToken(): Promise<string | null> {
  try {
    const result = await microsoftTeams.authentication.getAuthToken();
    return result;
  } catch (error) {
    console.error('Failed to get Teams auth token:', error);
    return null;
  }
}

/**
 * Open a link in Teams (uses Teams deep linking when appropriate)
 */
export function openInTeams(url: string): void {
  try {
    microsoftTeams.app.openLink(url);
  } catch {
    // Fallback for non-Teams context
    window.open(url, '_blank');
  }
}
