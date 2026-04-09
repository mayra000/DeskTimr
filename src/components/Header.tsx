// import { SlackIcon } from './SlackIcon'

export function Header() {
  return (
    <header className="app-header">
      <div className="app-logo" aria-hidden="true">
        DeskTimr
      </div>
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
