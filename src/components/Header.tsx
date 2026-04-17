// import { SlackIcon } from './SlackIcon'

export type AppMode = 'desk' | 'pomodoro'

type Props = {
  appMode: AppMode
  onAppModeChange: (mode: AppMode) => void
}

export function Header({ appMode, onAppModeChange }: Props) {
  return (
    <header className="app-header">
      <div className="app-logo" aria-hidden="true">
        DeskFocus
      </div>
      <nav className="app-header__mode" aria-label="View">
        {appMode === 'desk' ? (
          <button
            type="button"
            className="app-header__mode-btn"
            onClick={() => onAppModeChange('pomodoro')}
          >
            SWITCH TO POMODORO
          </button>
        ) : (
          <button
            type="button"
            className="app-header__mode-btn"
            onClick={() => onAppModeChange('desk')}
          >
            SWITCH TO STANDING TIMER
          </button>
        )}
      </nav>
      {/* Slack integration — upper right
      <button
        type="button"
        className="slack-placeholder"
        title="Slack integration — coming soon"
        aria-label="Slack integration — coming soon"
        disabled
      >
        <SlackIcon className="slack-placeholder__icon" />
      </button>
      */}
    </header>
  )
}
