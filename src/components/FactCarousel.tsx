import type { Fact } from '../data/facts'

type Props = {
  fact: Fact
  onPrev: () => void
  onNext: () => void
  /** Bumps only when the fact auto-advances; remounts the text node for a subtle enter animation. */
  autoAdvanceKey: number
}

export function FactCarousel({ fact, onPrev, onNext, autoAdvanceKey }: Props) {
  return (
    <div className="fact-carousel">
      <p
        key={autoAdvanceKey}
        className={
          'fact-carousel__text' +
          (autoAdvanceKey > 0 ? ' fact-carousel__text--auto-enter' : '')
        }
      >
        {fact.text}
      </p>
      <div className="fact-carousel__actions">
        <a
          className="fact-carousel__link"
          href={fact.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open source: ${fact.sourceLabel}`}
          title={fact.sourceLabel}
        >
          <svg
            className="fact-carousel__link-icon"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"
            />
          </svg>
        </a>
        <div className="fact-carousel__arrows" role="group" aria-label="Change fact">
          <button
            type="button"
            className="fact-carousel__arrow"
            onClick={onPrev}
            aria-label="Previous fact"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              <path fill="currentColor" d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
            </svg>
          </button>
          <button
            type="button"
            className="fact-carousel__arrow"
            onClick={onNext}
            aria-label="Next fact"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              <path fill="currentColor" d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
