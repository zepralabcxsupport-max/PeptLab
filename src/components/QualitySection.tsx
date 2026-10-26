import React from 'react';
import { ShieldCheck, Snowflake, CheckCircle, FileText, FlaskConical, Dna } from 'lucide-react';

export const QualitySection: React.FC = () => {
  return (
    <section id="quality" className="py-20 bg-[#F8F6F0] border-b border-[#E9E2D5]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <div className="text-xs font-medium tracking-wider uppercase text-[#829267] mb-2">
            GMP Synthesis & Analytical Standards
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-[#344E41]">
            Uncompromising Molecular Purity
          </h2>
          <p className="text-sm text-[#575D56] mt-3 leading-relaxed">
            Every peptide batch undergoes dual-stage chromatography and high-resolution mass spectrometry verification. We publish complete Certificates of Analysis for every lot.
          </p>
        </div>

        {/* 2-Column Split: Image on Left, 4 Standards on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden bg-[#E9E2D5] aspect-4/3 border border-[#E9E2D5] shadow-xs">
              <img
                src="/src/assets/images/category_botanical_lab_1793001338723.jpg"
                alt="PeptLab analytical laboratory and botanical research facility"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#292D29]/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 bg-[#24372D]/70 backdrop-blur-md p-4 rounded-xl text-white text-xs">
                <p className="font-medium text-[#A3B18A] mb-0.5">Continuous Argon Blanketing</p>
                <p className="text-white/80 text-[11px] leading-relaxed">
                  Vials are filled and capped under inert argon gas within an ISO 5 cleanroom enclosure to prevent atmospheric oxidation.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-[#344E41] text-[#A3B18A] flex items-center justify-center shrink-0">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-editorial text-xl font-bold text-[#344E41]">
                  Analytical RP-HPLC Validation
                </h4>
                <p className="text-xs text-[#575D56] leading-relaxed mt-1">
                  We mandate a minimum purity threshold of 99.0% for all catalog peptides, verified with reversed-phase high-performance liquid chromatography.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-[#344E41] text-[#A3B18A] flex items-center justify-center shrink-0">
                <Dna className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-editorial text-xl font-bold text-[#344E41]">
                  Mass Spectrometry (MS) Sequencing
                </h4>
                <p className="text-xs text-[#575D56] leading-relaxed mt-1">
                  Every sequence is verified against theoretical molecular mass via MALDI-TOF / ESI-MS to confirm exact amino acid chain alignment without truncations.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-[#344E41] text-[#A3B18A] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-editorial text-xl font-bold text-[#344E41]">
                  Endotoxin & Heavy Metal Clearance
                </h4>
                <p className="text-xs text-[#575D56] leading-relaxed mt-1">
                  Strict LAL chromogenic assays ensure endotoxin thresholds remain below 0.05 EU/mg, with zero heavy metal or residual TFA contaminants.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-[#344E41] text-[#A3B18A] flex items-center justify-center shrink-0">
                <Snowflake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-editorial text-xl font-bold text-[#344E41]">
                  Guaranteed Cold-Chain Logistics
                </h4>
                <p className="text-xs text-[#575D56] leading-relaxed mt-1">
                  Requisitions travel within specialized temperature-buffered thermal packages with real-time temperature verification cards.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
