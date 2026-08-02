import OnboardingV2Mobile from './OnboardingV2Mobile.jsx'
import '../styles/onboarding.css'

export default function OnboardingV2Version({ dark }) {
  return (
    <div
      className={`onboarding-root${dark ? ' dark' : ''}`}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 0,
        overflow: 'hidden',
        background: dark ? '#000' : '#f2f2f7',
      }}
    >
      <div className="onboarding-phone-shell">
        <OnboardingV2Mobile dark={dark} />
      </div>
    </div>
  )
}
