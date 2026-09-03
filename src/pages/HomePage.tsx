import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { QuickInfoStrip } from '../components/common/QuickInfoStrip';
import { WelcomeSection } from '../components/home/WelcomeSection';
import { PrincipalMessage } from '../components/home/PrincipalMessage';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { FacilitiesPreview } from '../components/home/FacilitiesPreview';
import { ActivitiesPreview } from '../components/home/ActivitiesPreview';
import { NoticesPreview } from '../components/home/NoticesPreview';
import { EventsPreview } from '../components/home/EventsPreview';
import { FacebookConnect } from '../components/home/FacebookConnect';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { AdmissionsCTA } from '../components/home/AdmissionsCTA';

export const HomePage: React.FC = () => {
  return (
    <div className="w-full">
      <HeroSection />
      <QuickInfoStrip />
      <WelcomeSection />
      <PrincipalMessage />
      <WhyChooseUs />
      <FacilitiesPreview />
      <ActivitiesPreview />
      <NoticesPreview />
      <EventsPreview />
      <FacebookConnect />
      <TestimonialsSection />
      <AdmissionsCTA />
    </div>
  );
};
