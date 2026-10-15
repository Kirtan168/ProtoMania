/**
 * PROTOMANIA Brand Mark: Concept A — The Proto Mark
 * Distinctive geometric sharp hexagonal outline incorporating a lightning bolt.
 * Represents: Energy, strength, precision, forward progress, tech-powered personalization.
 */

export function renderProtoMark(size = 40, className = "") {
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
      <!-- Outer Geometric Hexagon -->
      <polygon 
        points="50,5 92,26 92,74 50,95 8,74 8,26" 
        fill="#111410" 
        stroke="#D8FF3E" 
        stroke-width="7" 
        stroke-linejoin="round"
      />
      <!-- Inner Precision Glow Ring -->
      <polygon 
        points="50,14 84,31 84,69 50,86 16,69 16,31" 
        fill="#1B1E19" 
        stroke="#34382F" 
        stroke-width="2" 
      />
      <!-- Dynamic Acid Lime Lightning Bolt -->
      <polygon 
        points="54,19 33,49 50,49 44,81 67,43 51,43" 
        fill="#D8FF3E"
        filter="drop-shadow(0 0 6px rgba(216, 255, 62, 0.7))"
      />
    </svg>
  `;
}

export function renderProtoWordmark(size = "text-xl", showTagline = false) {
  return `
    <div class="flex flex-col">
      <div class="flex items-center space-x-1.5 font-mono font-black tracking-wider ${size} text-[#F4F5EF]">
        <span>PROTO</span><span class="text-[#D8FF3E]">MANIA</span>
      </div>
      ${showTagline ? `<span class="text-[10px] uppercase font-bold tracking-widest text-[#858A80]">Your Body. Your Budget. Your Era.</span>` : ''}
    </div>
  `;
}

export function renderBrandLogo(markSize = 36, textSize = "text-xl", showTagline = false) {
  return `
    <a href="#/" class="flex items-center space-x-3 group cursor-pointer">
      <div class="transition-transform duration-200 group-hover:scale-105 group-hover:rotate-3">
        ${renderProtoMark(markSize)}
      </div>
      ${renderProtoWordmark(textSize, showTagline)}
    </a>
  `;
}
