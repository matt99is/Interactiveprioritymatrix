import svgPaths from "./svg-3ic5blb7dx";

function FigmaSlidePreviewButtonContainer() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-[51px] mt-[17px] place-items-start relative" data-name="Figma Slide Preview Button Container">
      <div className="[grid-area:1_/_1] bg-[#d9d9d9] h-[13px] ml-0 mt-0 w-[63px]" data-name="CTA" />
      <div className="[grid-area:1_/_1] font-['TT_Commons_Pro:Medium',_sans-serif] h-2 ml-8 mt-[3px] not-italic relative text-[6px] text-black text-center translate-x-[-50%] w-[60px]">
        <p className="leading-[normal]">View</p>
      </div>
    </div>
  );
}

function FigmaSlidePreviewContainer() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Figma Slide Preview Container">
      <div className="[grid-area:1_/_1] bg-[#c6c6c6] h-[65px] ml-0 mt-0 w-[165px]" data-name="Figma Slide Preview Background" />
      <FigmaSlidePreviewButtonContainer />
      <div className="[grid-area:1_/_1] bg-white h-[22px] ml-0 mt-[43px] w-[165px]" data-name="Figma Slide Preview Button Background" />
      <div className="[grid-area:1_/_1] font-['TT_Commons_Pro:Bold',_sans-serif] h-2 leading-[0] ml-[9px] mt-[50px] not-italic relative text-[6px] text-black w-[60px]">
        <p className="leading-[normal]">Figma Slide Preview</p>
      </div>
    </div>
  );
}

function HighlightReelPreviewButtonContainer() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-[51px] mt-[17px] place-items-start relative" data-name="Highlight Reel Preview Button Container">
      <div className="[grid-area:1_/_1] bg-[#d9d9d9] h-[13px] ml-0 mt-0 w-[63px]" data-name="CTA" />
      <div className="[grid-area:1_/_1] font-['TT_Commons_Pro:Medium',_sans-serif] h-2 ml-8 mt-[3px] not-italic relative text-[6px] text-black text-center translate-x-[-50%] w-[60px]">
        <p className="leading-[normal]">Play</p>
      </div>
    </div>
  );
}

function HighlightReelPreviewContainer() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Highlight Reel Preview Container">
      <div className="[grid-area:1_/_1] bg-[#c6c6c6] h-[65px] ml-0 mt-0 w-[165px]" data-name="Highlight Reel Preview Background" />
      <HighlightReelPreviewButtonContainer />
      <div className="[grid-area:1_/_1] bg-white h-[22px] ml-0 mt-[43px] w-[165px]" data-name="Highlight Reel Preview Button Background" />
      <div className="[grid-area:1_/_1] font-['TT_Commons_Pro:Bold',_sans-serif] h-2 leading-[0] ml-[9px] mt-[50px] not-italic relative text-[6px] text-black w-[70px]">
        <p className="leading-[normal]">Highlight Reel Preview</p>
      </div>
    </div>
  );
}

function Content() {
  return (
    <div className="absolute content-stretch flex flex-col gap-3.5 items-start justify-start leading-[0] left-[19px] top-3 w-[165px]" data-name="Content">
      <div className="font-['Helpetica:Bold',_sans-serif] h-[35px] not-italic relative shrink-0 text-[24px] text-black w-full">
        <p className="leading-[36px]">Headline</p>
      </div>
      <div className="font-['TT_Commons_Pro:Regular',_sans-serif] h-[45px] not-italic relative shrink-0 text-[12px] text-black w-full">
        <p className="leading-[normal]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
      </div>
      <FigmaSlidePreviewContainer />
      <HighlightReelPreviewContainer />
      <div className="font-['TT_Commons_Pro:Medium',_sans-serif] h-[19px] not-italic relative shrink-0 text-[12px] text-black w-full">
        <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid leading-[normal] underline">Resource Links</p>
      </div>
    </div>
  );
}

function Cross() {
  return (
    <div className="absolute left-[179px] size-[11px] top-[9px]" data-name="Cross">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
        <g clipPath="url(#clip0_2_72)" id="Cross">
          <path d={svgPaths.p358a3080} fill="var(--fill-0, #2A2A2A)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_2_72">
            <rect fill="white" height="11" width="11" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[309px] left-44 top-[118px] w-[203px]" data-name="Container">
      <div className="absolute bg-[#d9d9d9] h-[309px] left-0 rounded-[2px] shadow-[2px_4px_4px_0px_rgba(0,0,0,0.25)] top-0 w-[203px]" data-name="Container Background" />
      <Content />
      <Cross />
    </div>
  );
}

export default function PriorityMatrixInteractionState() {
  return (
    <div className="bg-white relative size-full" data-name="Priority Matrix - Interaction State">
      <div className="absolute h-[365px] left-[340px] top-[71px] w-0" data-name="Y Axis">
        <div className="absolute bottom-0 left-[-5.77px] right-[-5.77px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 365">
            <path d={svgPaths.p1d17dcf0} fill="var(--stroke-0, #0059AB)" id="Y Axis" />
          </svg>
        </div>
      </div>
      <div className="absolute flex h-[0px] items-center justify-center left-[157px] top-[254px] w-[365px]">
        <div className="flex-none rotate-[270deg]">
          <div className="h-[365px] relative w-0" data-name="X Axis">
            <div className="absolute bottom-0 left-[-5.77px] right-[-5.77px] top-0">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 365">
                <path d={svgPaths.p34bdff00} fill="var(--stroke-0, #0059AB)" id="X Axis" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute font-['TT_Commons_Pro:Bold',_sans-serif] h-[15px] leading-[0] left-[340.5px] not-italic text-[12px] text-black text-center top-12 translate-x-[-50%] w-[99px]">
        <p className="leading-[normal]">High Prevalence</p>
      </div>
      <div className="absolute font-['TT_Commons_Pro:Bold',_sans-serif] h-[15px] leading-[0] left-[340.5px] not-italic text-[12px] text-black text-center top-[444px] translate-x-[-50%] w-[99px]">
        <p className="leading-[normal]">Low Prevalence</p>
      </div>
      <div className="absolute font-['TT_Commons_Pro:Bold',_sans-serif] h-[15px] leading-[0] left-[579.5px] not-italic text-[12px] text-black text-center top-[246px] translate-x-[-50%] w-[99px]">
        <p className="leading-[normal]">High Severity</p>
      </div>
      <div className="absolute font-['TT_Commons_Pro:Bold',_sans-serif] h-[15px] leading-[0] left-[99.5px] not-italic text-[12px] text-black text-center top-[246px] translate-x-[-50%] w-[99px]">
        <p className="leading-[normal]">Low Severity</p>
      </div>
      <div className="absolute left-[373px] size-2.5 top-[114px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="var(--fill-0, #E02440)" id="Ellipse 1" r="5" />
        </svg>
      </div>
      <div className="absolute left-[452px] size-2.5 top-[164px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="var(--fill-0, #E02440)" id="Ellipse 1" r="5" />
        </svg>
      </div>
      <div className="absolute left-[383px] size-2.5 top-[190px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="var(--fill-0, #E02440)" id="Ellipse 1" r="5" />
        </svg>
      </div>
      <div className="absolute left-[407px] size-2.5 top-[213px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="var(--fill-0, #E02440)" id="Ellipse 1" r="5" />
        </svg>
      </div>
      <div className="absolute left-[264px] size-2.5 top-[142px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="var(--fill-0, #E02440)" id="Ellipse 1" r="5" />
        </svg>
      </div>
      <div className="absolute left-[219px] size-2.5 top-[190px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="var(--fill-0, #E02440)" id="Ellipse 1" r="5" />
        </svg>
      </div>
      <div className="absolute left-[191px] size-2.5 top-[300px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="var(--fill-0, #FFB900)" id="Ellipse 7" r="5" />
        </svg>
      </div>
      <div className="absolute left-[281px] size-2.5 top-[324px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="var(--fill-0, #FFB900)" id="Ellipse 7" r="5" />
        </svg>
      </div>
      <div className="absolute left-[219px] size-2.5 top-[380px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="var(--fill-0, #FFB900)" id="Ellipse 7" r="5" />
        </svg>
      </div>
      <div className="absolute left-[407px] size-2.5 top-[398px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="var(--fill-0, #E02440)" id="Ellipse 1" r="5" />
        </svg>
      </div>
      <Container />
    </div>
  );
}