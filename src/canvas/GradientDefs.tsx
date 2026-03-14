/**
 * SVG <defs> block — all named gradients, patterns, and filters.
 *
 * Elevated Artisan style: rich food-realistic colors, visible fat marbling on
 * meats, creamy cheese tones, translucent rose for prosciutto, amber for Gouda.
 */

import React from 'react';

export function GradientDefs(): React.ReactElement {
  return (
    <defs>
      {/* ── BOARD TEXTURES ─────────────────────────────────────────────── */}
      <radialGradient id="boardWoodGrain" cx="48%" cy="38%" r="72%">
        <stop offset="0%"   stopColor="#F8EDD5" />
        <stop offset="30%"  stopColor="#EDD898" />
        <stop offset="65%"  stopColor="#D8BE78" />
        <stop offset="100%" stopColor="#C0A458" />
      </radialGradient>

      <radialGradient id="boardCircleGrain" cx="46%" cy="42%" r="65%">
        <stop offset="0%"   stopColor="#FAF0D8" />
        <stop offset="45%"  stopColor="#EEDDA0" />
        <stop offset="100%" stopColor="#D4C070" />
      </radialGradient>

      {/* Subtle wood grain lines pattern */}
      <pattern id="woodGrainLines" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
        <rect width="120" height="120" fill="none" />
        <path d="M0 15  Q60 12 120 18" stroke="#B89840" strokeWidth="0.7" fill="none" opacity="0.18" />
        <path d="M0 35  Q60 31 120 38" stroke="#B89840" strokeWidth="0.5" fill="none" opacity="0.12" />
        <path d="M0 55  Q60 52 120 58" stroke="#C8A858" strokeWidth="0.8" fill="none" opacity="0.20" />
        <path d="M0 75  Q60 72 120 78" stroke="#B89840" strokeWidth="0.5" fill="none" opacity="0.12" />
        <path d="M0 95  Q60 91 120 98" stroke="#B89840" strokeWidth="0.7" fill="none" opacity="0.18" />
        <path d="M0 110 Q60 107 120 113" stroke="#C8A858" strokeWidth="0.4" fill="none" opacity="0.10" />
      </pattern>

      {/* Warm inner glow over wood */}
      <radialGradient id="boardInnerGlow" cx="50%" cy="50%" r="55%">
        <stop offset="0%"   stopColor="#FFF8E8" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#FFF8E8" stopOpacity="0" />
      </radialGradient>

      {/* ── MEAT GRADIENTS ─────────────────────────────────────────────── */}
      {/* Prosciutto — pale rose, slightly translucent, silky */}
      <linearGradient id="prosciuttoFill" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#E8B0A8" />
        <stop offset="45%"  stopColor="#D08880" />
        <stop offset="100%" stopColor="#B06860" />
      </linearGradient>

      {/* Prosciutto fat streak — translucent cream overlay for marbling */}
      <linearGradient id="prosciuttoFatStreak" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#FAE8E0" stopOpacity="0" />
        <stop offset="30%"  stopColor="#FAE8E0" stopOpacity="0.55" />
        <stop offset="70%"  stopColor="#F0D8D0" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#F0D8D0" stopOpacity="0" />
      </linearGradient>

      {/* Serrano — deeper rose-red, more opaque */}
      <linearGradient id="serranoFill" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#CC7065" />
        <stop offset="50%"  stopColor="#A85050" />
        <stop offset="100%" stopColor="#883840" />
      </linearGradient>

      {/* Salami rosette — rich burgundy with depth */}
      <radialGradient id="salamiRosetteFill" cx="38%" cy="35%" r="68%">
        <stop offset="0%"   stopColor="#C44848" />
        <stop offset="55%"  stopColor="#8B3030" />
        <stop offset="100%" stopColor="#5A1818" />
      </radialGradient>

      {/* Salami fat marbling — cream-white dots */}
      <radialGradient id="salamiFatMarble" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#F8F0E8" />
        <stop offset="80%"  stopColor="#EDE4D4" />
        <stop offset="100%" stopColor="#E0D8C8" />
      </radialGradient>

      {/* Coppa — deep maroon with prominent marbling */}
      <radialGradient id="coppaFill" cx="38%" cy="35%" r="68%">
        <stop offset="0%"   stopColor="#C87060" />
        <stop offset="55%"  stopColor="#964838" />
        <stop offset="100%" stopColor="#6A2820" />
      </radialGradient>

      {/* ── CHEESE GRADIENTS ───────────────────────────────────────────── */}
      <radialGradient id="brieFill" cx="40%" cy="35%" r="70%">
        <stop offset="0%"   stopColor="#FAF4E8" />
        <stop offset="55%"  stopColor="#EEE0C0" />
        <stop offset="100%" stopColor="#D8C898" />
      </radialGradient>

      <radialGradient id="brieRind" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#F0EDE4" />
        <stop offset="100%" stopColor="#E0DDD0" />
      </radialGradient>

      <radialGradient id="manchegoFill" cx="40%" cy="35%" r="70%">
        <stop offset="0%"   stopColor="#F8E480" />
        <stop offset="55%"  stopColor="#E8C850" />
        <stop offset="100%" stopColor="#C8A028" />
      </radialGradient>

      <radialGradient id="manchegoRind" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#A88040" />
        <stop offset="100%" stopColor="#806020" />
      </radialGradient>

      {/* Gouda — rich amber-orange (not yellow) */}
      <radialGradient id="goudaFill" cx="30%" cy="30%" r="80%">
        <stop offset="0%"   stopColor="#F8C060" />
        <stop offset="45%"  stopColor="#E89828" />
        <stop offset="100%" stopColor="#C07010" />
      </radialGradient>

      <radialGradient id="goudaRind" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#C07820" />
        <stop offset="100%" stopColor="#A06010" />
      </radialGradient>

      {/* Cheddar — deep orange */}
      <radialGradient id="cheddarFill" cx="35%" cy="35%" r="70%">
        <stop offset="0%"   stopColor="#F4A855" />
        <stop offset="55%"  stopColor="#E08030" />
        <stop offset="100%" stopColor="#C06018" />
      </radialGradient>

      <radialGradient id="goatFill" cx="40%" cy="35%" r="70%">
        <stop offset="0%"   stopColor="#FDFAF0" />
        <stop offset="55%"  stopColor="#F0EAD8" />
        <stop offset="100%" stopColor="#E0D8C0" />
      </radialGradient>

      <radialGradient id="boursinFill" cx="45%" cy="40%" r="65%">
        <stop offset="0%"   stopColor="#FEFDF5" />
        <stop offset="55%"  stopColor="#F4EEE0" />
        <stop offset="100%" stopColor="#E6E0C8" />
      </radialGradient>

      <radialGradient id="humboldtFill" cx="40%" cy="35%" r="70%">
        <stop offset="0%"   stopColor="#F5F0E8" />
        <stop offset="44%"  stopColor="#E8E0D0" />
        <stop offset="45%"  stopColor="#5A5A5A" />
        <stop offset="55%"  stopColor="#5A5A5A" />
        <stop offset="56%"  stopColor="#E8E0D0" />
        <stop offset="100%" stopColor="#D8D0B8" />
      </radialGradient>

      {/* ── FRUIT GRADIENTS ────────────────────────────────────────────── */}
      <radialGradient id="greenGrapeFill" cx="35%" cy="28%" r="70%">
        <stop offset="0%"   stopColor="#D8F098" />
        <stop offset="55%"  stopColor="#8FBA5E" />
        <stop offset="100%" stopColor="#608030" />
      </radialGradient>

      <radialGradient id="redGrapeFill" cx="35%" cy="28%" r="70%">
        <stop offset="0%"   stopColor="#D07080" />
        <stop offset="55%"  stopColor="#A02848" />
        <stop offset="100%" stopColor="#701028" />
      </radialGradient>

      <radialGradient id="strawberryFill" cx="40%" cy="28%" r="70%">
        <stop offset="0%"   stopColor="#FF7888" />
        <stop offset="55%"  stopColor="#E83448" />
        <stop offset="100%" stopColor="#B81428" />
      </radialGradient>

      <radialGradient id="blueberryFill" cx="35%" cy="28%" r="70%">
        <stop offset="0%"   stopColor="#8090D8" />
        <stop offset="55%"  stopColor="#4050A8" />
        <stop offset="100%" stopColor="#282870" />
      </radialGradient>

      <radialGradient id="raspberryFill" cx="40%" cy="28%" r="70%">
        <stop offset="0%"   stopColor="#F87090" />
        <stop offset="55%"  stopColor="#D02860" />
        <stop offset="100%" stopColor="#A00840" />
      </radialGradient>

      <radialGradient id="blackberryFill" cx="35%" cy="28%" r="70%">
        <stop offset="0%"   stopColor="#706090" />
        <stop offset="55%"  stopColor="#402868" />
        <stop offset="100%" stopColor="#201040" />
      </radialGradient>

      <radialGradient id="mandarinFill" cx="40%" cy="35%" r="65%">
        <stop offset="0%"   stopColor="#FFB868" />
        <stop offset="55%"  stopColor="#F07020" />
        <stop offset="100%" stopColor="#C04808" />
      </radialGradient>

      <radialGradient id="kiwiFill" cx="40%" cy="40%" r="60%">
        <stop offset="0%"   stopColor="#98D858" />
        <stop offset="55%"  stopColor="#58A020" />
        <stop offset="100%" stopColor="#306808" />
      </radialGradient>

      {/* ── DRAGON FRUIT — Signature CO Visual Hero ────────────────────── */}
      <radialGradient id="dragonFruitSkin" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#FF4A7A" />
        <stop offset="65%"  stopColor="#E8205A" />
        <stop offset="100%" stopColor="#B80048" />
      </radialGradient>

      <radialGradient id="dragonFruitInterior" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#FFFFFF" />
        <stop offset="75%"  stopColor="#F8F0F0" />
        <stop offset="100%" stopColor="#EEE4E4" />
      </radialGradient>

      {/* ── ACCOUTREMENTS ──────────────────────────────────────────────── */}
      <radialGradient id="pistachioFill" cx="40%" cy="35%" r="70%">
        <stop offset="0%"   stopColor="#DCEEA0" />
        <stop offset="55%"  stopColor="#A8C860" />
        <stop offset="100%" stopColor="#70A028" />
      </radialGradient>

      <radialGradient id="walnutFill" cx="35%" cy="30%" r="70%">
        <stop offset="0%"   stopColor="#C8A070" />
        <stop offset="55%"  stopColor="#987040" />
        <stop offset="100%" stopColor="#684820" />
      </radialGradient>

      <radialGradient id="cornichonFill" cx="40%" cy="35%" r="65%">
        <stop offset="0%"   stopColor="#A0D878" />
        <stop offset="55%"  stopColor="#6B9040" />
        <stop offset="100%" stopColor="#406020" />
      </radialGradient>

      <radialGradient id="oliveFill" cx="40%" cy="35%" r="65%">
        <stop offset="0%"   stopColor="#B0D078" />
        <stop offset="55%"  stopColor="#7A9840" />
        <stop offset="100%" stopColor="#506020" />
      </radialGradient>

      {/* ── JAR GRADIENTS ──────────────────────────────────────────────── */}
      <linearGradient id="jamJarBody" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%"   stopColor="#E85848" stopOpacity="0.92" />
        <stop offset="100%" stopColor="#B82820" stopOpacity="0.92" />
      </linearGradient>

      <linearGradient id="honeyJarBody" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%"   stopColor="#F8D048" stopOpacity="0.96" />
        <stop offset="100%" stopColor="#C89018" stopOpacity="0.96" />
      </linearGradient>

      {/* Glass sheen — diagonal white highlight stripe */}
      <linearGradient id="jarGlassSheen" x1="0%" y1="0%" x2="40%" y2="100%">
        <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.55" />
        <stop offset="60%"  stopColor="#FFFFFF" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>

      <linearGradient id="jarLidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#888888" />
        <stop offset="100%" stopColor="#555555" />
      </linearGradient>

      {/* ── CHOCOLATE ──────────────────────────────────────────────────── */}
      <radialGradient id="chocolateFill" cx="35%" cy="30%" r="70%">
        <stop offset="0%"   stopColor="#704028" />
        <stop offset="55%"  stopColor="#4A2810" />
        <stop offset="100%" stopColor="#2E1408" />
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

      {/* ── BOARD VIGNETTE ─────────────────────────────────────────────── */}
      <radialGradient id="boardVignette" cx="50%" cy="50%" r="68%">
        <stop offset="55%"  stopColor="#000000" stopOpacity="0" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.14" />
      </radialGradient>
    </defs>
  );
}
