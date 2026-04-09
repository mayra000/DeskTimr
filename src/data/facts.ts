export interface Fact {
  text: string
  sourceUrl: string
  sourceLabel: string
}

export const FACTS: readonly Fact[] = [
  {
    text: 'Breaking up long sitting with standing or light movement is linked to better metabolic health.',
    sourceUrl: 'https://www.cdc.gov/physicalactivity/index.html',
    sourceLabel: 'CDC',
  },
  {
    text: 'Even short movement breaks can reduce muscle stiffness from staying in one posture.',
    sourceUrl: 'https://www.nhs.uk/live-well/exercise/sitting-for-long-periods/',
    sourceLabel: 'NHS',
  },
  {
    text: 'Alternating between sitting and standing at work can help you vary load on your back and legs.',
    sourceUrl: 'https://www.osha.gov/etools/computer-workstations/components/positioning',
    sourceLabel: 'OSHA',
  },
  {
    text: 'Prolonged uninterrupted sitting is associated with increased cardiovascular risk in many studies.',
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/physical-activity',
    sourceLabel: 'WHO',
  },
  {
    text: 'Standing burns more calories than sitting, though the difference is modest for most people.',
    sourceUrl:
      'https://www.health.harvard.edu/heart-health/standing-vs-sitting-fewer-pounds-less-heart-disease',
    sourceLabel: 'Harvard Health',
  },
  {
    text: 'Extended sitting is linked to metabolic risks including higher blood sugar; breaking up sitting time may help.',
    sourceUrl: 'https://www.mayoclinic.org/healthy-lifestyle/adult-health/expert-answers/sitting/faq-20058005',
    sourceLabel: 'Mayo Clinic',
  },
  {
    text: 'Guidelines recommend adults reduce sedentary time and build activity into the week—not only planned workouts.',
    sourceUrl:
      'https://www.nhs.uk/live-well/exercise/physical-activity-guidelines-for-adults-aged-19-to-64/',
    sourceLabel: 'NHS',
  },
  {
    text: 'Physical activity lowers risk for several chronic diseases; sitting less and moving more both contribute.',
    sourceUrl:
      'https://www.cancer.gov/about-cancer/causes-prevention/risk/obesity/physical-activity-fact-sheet',
    sourceLabel: 'NIH National Cancer Institute',
  },
  {
    text: 'Light activity like standing or strolling can ease stiffness in the hips and lower back compared with staying seated.',
    sourceUrl: 'https://www.nhs.uk/live-well/exercise/sitting-for-long-periods/',
    sourceLabel: 'NHS',
  },
]
