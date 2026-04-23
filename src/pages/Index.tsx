import { Header } from "@/components/ui/header";
import { HeroSection } from "@/components/ui/hero-section";
import { SearchForm } from "@/components/ui/search-form";
import { WhySection } from "@/components/ui/why-section";
import { HowItWorksSection } from "@/components/ui/how-it-works-section";
import { ServicesSection } from "@/components/ui/services-section";
import { UserTypesSection } from "@/components/ui/user-types-section";
import { UseCasesSection } from "@/components/ui/use-cases-section";
import { HomeFAQSection } from "@/components/ui/home-faq-section";
import { Footer } from "@/components/ui/footer";
import { FloatingContact } from "@/components/ui/floating-contact";
import { SEOHead } from "@/components/seo/SEOHead";
import { ExpertBio } from "@/components/ui/expert-bio";
import { getRandomExpert } from "@/data/expertsData";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Accompagnement Animal Partout en France | Accompagnateurs Certifiés | DogWalking"
        description="Trouvez un Accompagnateur Certifié près de chez vous. Paiement sécurisé, code unique et preuves visuelles obligatoires. Service de promenade et garde dans toute la France."
        canonical="https://dogwalking.fr"
      />
      <Header />
      <main>
        {/* 1. Hero + recherche */}
        <HeroSection />
        <section className="py-8 md:py-12 px-4 -mt-16 md:-mt-24 relative z-10">
          <div className="container mx-auto">
            <SearchForm />
          </div>
        </section>

        {/* 2. Services proposés */}
        <ServicesSection />

        {/* 3. Déclencheurs concrets — quand on a besoin de la plateforme */}
        <UseCasesSection />

        {/* 4. Comment ça marche (3 étapes) */}
        <HowItWorksSection />

        {/* 5. Pourquoi nous (sécurité, code, preuves) — UN SEUL bloc confiance */}
        <WhySection />

        {/* 6. Propriétaires / Accompagnateurs */}
        <UserTypesSection />

        {/* 7. FAQ */}
        <HomeFAQSection />

        {/* 8. Expert E-E-A-T (centré) */}
        <section className="py-16 md:py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 md:mb-12 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                L'expertise au service de votre animal
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                Notre comité scientifique réunit vétérinaires et comportementalistes reconnus.
              </p>
            </div>
            <ExpertBio expert={getRandomExpert()} />
          </div>
        </section>
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default Index;
