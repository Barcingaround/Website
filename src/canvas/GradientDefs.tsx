/**
 * SVG <defs> block — all named gradients, patterns, and filters.
 *
 * v2 Artisan style: off-center focal points (fx/fy) for spherical 3D look,
 * 5–6 stop gradients for depth, SVG <pattern> elements for realistic textures.
 */

import React from 'react';

export function GradientDefs(): React.ReactElement {
  return (
    <defs>
      {/* ── BOARD TEXTURES ─────────────────────────────────────────────── */}
      <radialGradient id="boardWoodGrain" cx="48%" cy="38%" fx="42%" fy="32%" r="72%">
        <stop offset="0%"   stopColor="#FBF3DC" />
        <stop offset="20%"  stopColor="#F2E4B4" />
        <stop offset="45%"  stopColor="#E4CF8C" />
        <stop offset="75%"  stopColor="#D6BC6C" />
        <stop offset="100%" stopColor="#C2A454" />
      </radialGradient>

      <radialGradient id="boardCircleGrain" cx="46%" cy="42%" fx="40%" fy="36%" r="65%">
        <stop offset="0%"   stopColor="#FCF2DC" />
        <stop offset="35%"  stopColor="#F0DFA4" />
        <stop offset="70%"  stopColor="#DFCA78" />
        <stop offset="100%" stopColor="#CAB060" />
      </radialGradient>

      {/* Subtle wood grain lines pattern */}
      <pattern id="woodGrainLines" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
        <rect width="120" height="120" fill="none" />
        <path d="M0 12  Q40 9  80 14 Q100 16 120 13" stroke="#A88830" strokeWidth="0.8" fill="none" opacity="0.16" />
        <path d="M0 28  Q50 24 90 30 Q108 32 120 28" stroke="#B89840" strokeWidth="0.5" fill="none" opacity="0.11" />
        <path d="M0 44  Q35 40 70 46 Q95 49 120 44" stroke="#C4A450" strokeWidth="0.9" fill="none" opacity="0.19" />
        <path d="M0 60  Q55 57 95 62 Q110 63 120 60" stroke="#A88830" strokeWidth="0.5" fill="none" opacity="0.12" />
        <path d="M0 76  Q45 72 80 78 Q102 80 120 76" stroke="#B09038" strokeWidth="0.7" fill="none" opacity="0.17" />
        <path d="M0 92  Q60 88 100 94 Q112 95 120 92" stroke="#C4A450" strokeWidth="0.4" fill="none" opacity="0.10" />
        <path d="M0 108 Q38 105 72 110 Q98 113 120 108" stroke="#B09038" strokeWidth="0.6" fill="none" opacity="0.14" />
      </pattern>

      {/* Warm inner glow over wood */}
      <radialGradient id="boardInnerGlow" cx="50%" cy="50%" fx="48%" fy="46%" r="58%">
        <stop offset="0%"   stopColor="#FFF8E8" stopOpacity="0.22" />
        <stop offset="55%"  stopColor="#FFF4E0" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#FFF8E8" stopOpacity="0" />
      </radialGradient>

      {/* ── MEAT GRADIENTS ─────────────────────────────────────────────── */}
      {/* Prosciutto — pale rose silk, translucent, off-center highlight */}
      <linearGradient id="prosciuttoFill" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#F0C0B4" />
        <stop offset="25%"  stopColor="#E4A09A" />
        <stop offset="55%"  stopColor="#D08880" />
        <stop offset="80%"  stopColor="#BC6870" />
        <stop offset="100%" stopColor="#A85868" />
      </linearGradient>

      {/* Prosciutto fat streak — cream marbling overlay */}
      <linearGradient id="prosciuttoFatStreak" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#FAE8E0" stopOpacity="0" />
        <stop offset="20%"  stopColor="#FAE8E0" stopOpacity="0.40" />
        <stop offset="50%"  stopColor="#F8EAE2" stopOpacity="0.65" />
        <stop offset="80%"  stopColor="#F0D8D0" stopOpacity="0.38" />
        <stop offset="100%" stopColor="#F0D8D0" stopOpacity="0" />
      </linearGradient>

      {/* Serrano — deeper rose-red, slightly chewy opacity */}
      <linearGradient id="serranoFill" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#D88080" />
        <stop offset="30%"  stopColor="#C46868" />
        <stop offset="60%"  stopColor="#A85050" />
        <stop offset="85%"  stopColor="#8E3838" />
        <stop offset="100%" stopColor="#7A2828" />
      </linearGradient>

      {/* Coppa — maroon, deep marbling */}
      <radialGradient id="coppaFill" cx="35%" cy="30%" fx="28%" fy="22%" r="72%">
        <stop offset="0%"   stopColor="#D88070" />
        <stop offset="30%"  stopColor="#B86050" />
        <stop offset="60%"  stopColor="#964838" />
        <stop offset="85%"  stopColor="#783020" />
        <stop offset="100%" stopColor="#5E1C10" />
      </radialGradient>

      {/* Salami rosette — rich burgundy, off-center highlight for dome effect */}
      <radialGradient id="salamiRosetteFill" cx="36%" cy="32%" fx="26%" fy="22%" r="72%">
        <stop offset="0%"   stopColor="#D85858" />
        <stop offset="25%"  stopColor="#C44040" />
        <stop offset="55%"  stopColor="#8B3030" />
        <stop offset="80%"  stopColor="#682020" />
        <stop offset="100%" stopColor="#4A1010" />
      </radialGradient>

      {/* Salami fat marbling — creamy white dots, off-center for 3D sphere */}
      <radialGradient id="salamiFatMarble" cx="38%" cy="34%" fx="28%" fy="24%" r="68%">
        <stop offset="0%"   stopColor="#FDFAF0" />
        <stop offset="45%"  stopColor="#F4EDE0" />
        <stop offset="80%"  stopColor="#E8E0CC" />
        <stop offset="100%" stopColor="#DDD4B8" />
      </radialGradient>

      {/* ── CHEESE GRADIENTS ───────────────────────────────────────────── */}
      {/* Brie — creamy ivory, subtle off-center glow */}
      <radialGradient id="brieFill" cx="38%" cy="33%" fx="28%" fy="22%" r="74%">
        <stop offset="0%"   stopColor="#FFFDF2" />
        <stop offset="22%"  stopColor="#F8F2E2" />
        <stop offset="50%"  stopColor="#EDE0C0" />
        <stop offset="78%"  stopColor="#DDD0A0" />
        <stop offset="100%" stopColor="#CCC090" />
      </radialGradient>

      <radialGradient id="brieRind" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#F4F1E6" />
        <stop offset="60%"  stopColor="#E8E5D6" />
        <stop offset="100%" stopColor="#DCDAC6" />
      </radialGradient>

      {/* Manchego — golden, slightly waxy */}
      <radialGradient id="manchegoFill" cx="40%" cy="34%" fx="30%" fy="24%" r="72%">
        <stop offset="0%"   stopColor="#FFF0A0" />
        <stop offset="22%"  stopColor="#F8E080" />
        <stop offset="50%"  stopColor="#E8C850" />
        <stop offset="75%"  stopColor="#D4A828" />
        <stop offset="100%" stopColor="#B88810" />
      </radialGradient>

      <radialGradient id="manchegoRind" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#B09050" />
        <stop offset="60%"  stopColor="#907030" />
        <stop offset="100%" stopColor="#705018" />
      </radialGradient>

      {/* Manchego herringbone basket-weave pattern */}
      <pattern id="manchegoWeave" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="none" />
        <line x1="0" y1="0" x2="8" y2="8" stroke="#806020" strokeWidth="0.8" opacity="0.28" />
        <line x1="0" y1="4" x2="4" y2="8" stroke="#806020" strokeWidth="0.6" opacity="0.18" />
        <line x1="4" y1="0" x2="8" y2="4" stroke="#806020" strokeWidth="0.6" opacity="0.18" />
      </pattern>

      {/* Gouda — rich amber-orange with off-center specular highlight */}
      <radialGradient id="goudaFill" cx="28%" cy="26%" fx="18%" fy="16%" r="82%">
        <stop offset="0%"   stopColor="#FFD070" />
        <stop offset="22%"  stopColor="#F8B840" />
        <stop offset="50%"  stopColor="#E89828" />
        <stop offset="75%"  stopColor="#D07C10" />
        <stop offset="100%" stopColor="#B46000" />
      </radialGradient>

      <radialGradient id="goudaRind" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#C88028" />
        <stop offset="60%"  stopColor="#A86010" />
        <stop offset="100%" stopColor="#884800" />
      </radialGradient>

      {/* Gouda crystal pattern — small bright flecks */}
      <pattern id="goudaCrystals" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="12" height="12" fill="none" />
        <circle cx="3" cy="3" r="1.2" fill="#FFE090" opacity="0.45" />
        <circle cx="9" cy="7" r="0.9" fill="#FFE8A0" opacity="0.38" />
        <circle cx="6" cy="10" r="1.0" fill="#FFD878" opacity="0.32" />
      </pattern>

      {/* Cheddar — deep orange with warmth */}
      <radialGradient id="cheddarFill" cx="34%" cy="30%" fx="24%" fy="20%" r="74%">
        <stop offset="0%"   stopColor="#FFC068" />
        <stop offset="25%"  stopColor="#F8A848" />
        <stop offset="55%"  stopColor="#E08030" />
        <stop offset="78%"  stopColor="#C86018" />
        <stop offset="100%" stopColor="#A84800" />
      </radialGradient>

      {/* Cheddar crystal pattern */}
      <pattern id="cheddarCrystals" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="10" height="10" fill="none" />
        <circle cx="2.5" cy="2.5" r="1.0" fill="#FFD080" opacity="0.38" />
        <circle cx="7.5" cy="6.5" r="0.8" fill="#FFE090" opacity="0.30" />
        <circle cx="5" cy="9"   r="0.9" fill="#FFC860" opacity="0.28" />
      </pattern>

      <radialGradient id="goatFill" cx="40%" cy="34%" fx="30%" fy="24%" r="72%">
        <stop offset="0%"   stopColor="#FEFCF2" />
        <stop offset="40%"  stopColor="#F4EEDC" />
        <stop offset="75%"  stopColor="#E8E0C4" />
        <stop offset="100%" stopColor="#D8D4B4" />
      </radialGradient>

      <radialGradient id="boursinFill" cx="44%" cy="38%" fx="34%" fy="28%" r="68%">
        <stop offset="0%"   stopColor="#FEFEF8" />
        <stop offset="35%"  stopColor="#F8F4E8" />
        <stop offset="65%"  stopColor="#EEE8D4" />
        <stop offset="100%" stopColor="#E0D8C0" />
      </radialGradient>

      {/* Humboldt Fog — white with distinctive grey ash layer */}
      <radialGradient id="humboldtFill" cx="40%" cy="34%" fx="30%" fy="24%" r="72%">
        <stop offset="0%"   stopColor="#F8F4EC" />
        <stop offset="40%"  stopColor="#EDE5D4" />
        <stop offset="44%"  stopColor="#EDE5D4" />
        <stop offset="45%"  stopColor="#5E5E5A" />
        <stop offset="54%"  stopColor="#5E5E5A" />
        <stop offset="55%"  stopColor="#EDE5D4" />
        <stop offset="85%"  stopColor="#E0D8C0" />
        <stop offset="100%" stopColor="#D4CCA8" />
      </radialGradient>

      {/* ── FRUIT GRADIENTS ────────────────────────────────────────────── */}
      {/* Green Grapes — spherical with off-center specular */}
      <radialGradient id="greenGrapeFill" cx="32%" cy="26%" fx="22%" fy="16%" r="74%">
        <stop offset="0%"   stopColor="#E8FFA8" />
        <stop offset="25%"  stopColor="#C8F070" />
        <stop offset="55%"  stopColor="#8FBA5E" />
        <stop offset="80%"  stopColor="#6A9040" />
        <stop offset="100%" stopColor="#4A6820" />
      </radialGradient>

      {/* Red Grapes — deep ruby spheres */}
      <radialGradient id="redGrapeFill" cx="32%" cy="26%" fx="22%" fy="16%" r="74%">
        <stop offset="0%"   stopColor="#E89098" />
        <stop offset="25%"  stopColor="#C86070" />
        <stop offset="55%"  stopColor="#A02848" />
        <stop offset="80%"  stopColor="#801030" />
        <stop offset="100%" stopColor="#600020" />
      </radialGradient>

      {/* Strawberry — bright red with pointed teardrop shape */}
      <radialGradient id="strawberryFill" cx="40%" cy="26%" fx="30%" fy="16%" r="74%">
        <stop offset="0%"   stopColor="#FF9090" />
        <stop offset="22%"  stopColor="#FF6870" />
        <stop offset="50%"  stopColor="#E83448" />
        <stop offset="78%"  stopColor="#C01428" />
        <stop offset="100%" stopColor="#9A0018" />
      </radialGradient>

      {/* Blueberry — dark indigo with subtle bloom on skin */}
      <radialGradient id="blueberryFill" cx="32%" cy="26%" fx="20%" fy="14%" r="76%">
        <stop offset="0%"   stopColor="#A0B0E8" />
        <stop offset="25%"  stopColor="#7080C8" />
        <stop offset="55%"  stopColor="#4050A8" />
        <stop offset="80%"  stopColor="#283880" />
        <stop offset="100%" stopColor="#181860" />
      </radialGradient>

      {/* Raspberry — crimson pink drupelets */}
      <radialGradient id="raspberryFill" cx="38%" cy="28%" fx="28%" fy="18%" r="72%">
        <stop offset="0%"   stopColor="#FFA0B0" />
        <stop offset="22%"  stopColor="#F07090" />
        <stop offset="55%"  stopColor="#D02860" />
        <stop offset="80%"  stopColor="#A80840" />
        <stop offset="100%" stopColor="#840030" />
      </radialGradient>

      {/* Blackberry — near-black purple with bloom */}
      <radialGradient id="blackberryFill" cx="32%" cy="26%" fx="20%" fy="14%" r="76%">
        <stop offset="0%"   stopColor="#9080B0" />
        <stop offset="25%"  stopColor="#604888" />
        <stop offset="55%"  stopColor="#402868" />
        <stop offset="80%"  stopColor="#281048" />
        <stop offset="100%" stopColor="#180030" />
      </radialGradient>

      {/* Mandarin / orange */}
      <radialGradient id="mandarinFill" cx="38%" cy="33%" fx="28%" fy="22%" r="68%">
        <stop offset="0%"   stopColor="#FFD080" />
        <stop offset="28%"  stopColor="#FFA848" />
        <stop offset="55%"  stopColor="#F07020" />
        <stop offset="80%"  stopColor="#C84800" />
        <stop offset="100%" stopColor="#A03000" />
      </radialGradient>

      {/* Kiwi — vivid green with white center */}
      <radialGradient id="kiwiFill" cx="42%" cy="40%" fx="32%" fy="30%" r="64%">
        <stop offset="0%"   stopColor="#B0E870" />
        <stop offset="28%"  stopColor="#88C840" />
        <stop offset="55%"  stopColor="#58A020" />
        <stop offset="80%"  stopColor="#387008" />
        <stop offset="100%" stopColor="#204800" />
      </radialGradient>

      {/* ── DRAGON FRUIT — Signature CO Visual Hero ────────────────────── */}
      <radialGradient id="dragonFruitSkin" cx="40%" cy="36%" fx="28%" fy="24%" r="68%">
        <stop offset="0%"   stopColor="#FF7AA0" />
        <stop offset="28%"  stopColor="#FF3878" />
        <stop offset="60%"  stopColor="#E0105A" />
        <stop offset="85%"  stopColor="#B80040" />
        <stop offset="100%" stopColor="#920030" />
      </radialGradient>

      <radialGradient id="dragonFruitInterior" cx="48%" cy="44%" fx="38%" fy="34%" r="58%">
        <stop offset="0%"   stopColor="#FFFFFF" />
        <stop offset="40%"  stopColor="#FBF6F4" />
        <stop offset="80%"  stopColor="#F0E8E8" />
        <stop offset="100%" stopColor="#E8DEDE" />
      </radialGradient>

      {/* ── ACCOUTREMENTS ──────────────────────────────────────────────── */}
      <radialGradient id="pistachioFill" cx="38%" cy="32%" fx="28%" fy="22%" r="72%">
        <stop offset="0%"   stopColor="#E8F8B0" />
        <stop offset="28%"  stopColor="#C8E878" />
        <stop offset="55%"  stopColor="#A0C858" />
        <stop offset="80%"  stopColor="#78A030" />
        <stop offset="100%" stopColor="#507810" />
      </radialGradient>

      <radialGradient id="walnutFill" cx="34%" cy="28%" fx="24%" fy="18%" r="72%">
        <stop offset="0%"   stopColor="#D8B888" />
        <stop offset="28%"  stopColor="#C0A070" />
        <stop offset="55%"  stopColor="#987040" />
        <stop offset="80%"  stopColor="#7A5020" />
        <stop offset="100%" stopColor="#5A3008" />
      </radialGradient>

      <radialGradient id="cornichonFill" cx="38%" cy="32%" fx="28%" fy="22%" r="68%">
        <stop offset="0%"   stopColor="#B8E890" />
        <stop offset="28%"  stopColor="#98D068" />
        <stop offset="55%"  stopColor="#6B9040" />
        <stop offset="80%"  stopColor="#4A6C20" />
        <stop offset="100%" stopColor="#2E4808" />
      </radialGradient>

      <radialGradient id="oliveFill" cx="38%" cy="32%" fx="28%" fy="22%" r="68%">
        <stop offset="0%"   stopColor="#C8E090" />
        <stop offset="28%"  stopColor="#A8C868" />
        <stop offset="55%"  stopColor="#7A9840" />
        <stop offset="80%"  stopColor="#587020" />
        <stop offset="100%" stopColor="#384808" />
      </radialGradient>

      {/* ── JAR GRADIENTS ──────────────────────────────────────────────── */}
      <linearGradient id="jamJarBody" x1="15%" y1="0%" x2="85%" y2="100%">
        <stop offset="0%"   stopColor="#F07060" stopOpacity="0.94" />
        <stop offset="35%"  stopColor="#E05848" stopOpacity="0.92" />
        <stop offset="70%"  stopColor="#C83828" stopOpacity="0.90" />
        <stop offset="100%" stopColor="#A81818" stopOpacity="0.90" />
      </linearGradient>

      <linearGradient id="honeyJarBody" x1="15%" y1="0%" x2="85%" y2="100%">
        <stop offset="0%"   stopColor="#FFE068" stopOpacity="0.96" />
        <stop offset="35%"  stopColor="#F8C840" stopOpacity="0.94" />
        <stop offset="70%"  stopColor="#E09820" stopOpacity="0.94" />
        <stop offset="100%" stopColor="#C07800" stopOpacity="0.92" />
      </linearGradient>

      {/* Glass sheen — diagonal white highlight stripe */}
      <linearGradient id="jarGlassSheen" x1="0%" y1="0%" x2="35%" y2="100%">
        <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.62" />
        <stop offset="40%"  stopColor="#FFFFFF" stopOpacity="0.28" />
        <stop offset="75%"  stopColor="#FFFFFF" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>

      <linearGradient id="jarLidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#A0A0A0" />
        <stop offset="45%"  stopColor="#787878" />
        <stop offset="100%" stopColor="#484848" />
      </linearGradient>

      {/* ── CHOCOLATE ──────────────────────────────────────────────────── */}
      <radialGradient id="chocolateFill" cx="34%" cy="28%" fx="24%" fy="18%" r="72%">
        <stop offset="0%"   stopColor="#886040" />
        <stop offset="28%"  stopColor="#604820" />
        <stop offset="55%"  stopColor="#482808" />
        <stop offset="100%" stopColor="#2C1000" />
      </radialGradient>

      {/* ── SHADOWS & FILTERS ──────────────────────────────────────────── */}
      <filter id="ingredientShadow" x="-15%" y="-10%" width="130%" height="135%">
        <feDropShadow dx="1" dy="2" stdDeviation="3" floodColor="#2A1500" floodOpacity="0.28" />
      </filter>

      <filter id="softShadow" x="-20%" y="-15%" width="140%" height="145%">
        <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#2A1500" floodOpacity="0.20" />
      </filter>

      <filter id="meatShadow" x="-15%" y="-10%" width="130%" height="140%">
        <feDropShadow dx="1" dy="2.5" stdDeviation="4" floodColor="#3A0800" floodOpacity="0.22" />
      </filter>

      <filter id="jarShadow" x="-25%" y="-20%" width="150%" height="155%">
        <feDropShadow dx="2" dy="4" stdDeviation="6" floodColor="#1A0800" floodOpacity="0.35" />
      </filter>

      {/* Specular highlight filter for grapes/fruit */}
      <filter id="fruitGlow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      {/* ── BOARD VIGNETTE ─────────────────────────────────────────────── */}
      <radialGradient id="boardVignette" cx="50%" cy="50%" r="68%">
        <stop offset="50%"  stopColor="#000000" stopOpacity="0" />
        <stop offset="80%"  stopColor="#000000" stopOpacity="0.06" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.16" />
      </radialGradient>
    </defs>
  );
}
