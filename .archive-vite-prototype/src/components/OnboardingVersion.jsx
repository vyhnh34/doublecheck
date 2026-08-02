import OnboardingMobile from './OnboardingMobile.jsx'
import '../styles/onboarding.css'

export default function OnboardingVersion({ dark, s2variant }) {
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
        <OnboardingMobile dark={dark} s2variant={s2variant} />
      </div>
    </div>
  )
}
