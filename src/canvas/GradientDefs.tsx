/**
 * SVG <defs> block — all named gradients, patterns, and filters used by ingredient drawers.
 * Watercolor Botanical style: soft radial blooms, warm cream-to-ivory boards, painterly shadows.
 */

import React from 'react';

export function GradientDefs(): React.ReactElement {
  return (
    <defs>
      {/* ── BOARD TEXTURES ─────────────────────────────────────────────── */}
      <radialGradient id="boardWoodGrain" cx="50%" cy="40%" r="70%">
        <stop offset="0%"  stopColor="#F5E8C8" />
        <stop offset="40%" stopColor="#ECD9A8" />
        <stop offset="80%" stopColor="#E0CA8A" />
        <stop offset="100%" stopColor="#D4BC72" />
      </radialGradient>

      <radialGradient id="boardCircleGrain" cx="48%" cy="44%" r="65%">
        <stop offset="0%"  stopColor="#F8EDD0" />
        <stop offset="50%" stopColor="#EFD9A5" />
        <stop offset="100%" stopColor="#D8C080" />
      </radialGradient>

      {/* Subtle wood grain lines pattern */}
      <pattern id="woodGrainLines" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <rect width="80" height="80" fill="none" />
        <path d="M0 20 Q40 18 80 22" stroke="#C8A855" strokeWidth="0.6" fill="none" opacity="0.3" />
        <path d="M0 40 Q40 37 80 42" stroke="#C8A855" strokeWidth="0.5" fill="none" opacity="0.2" />
        <path d="M0 60 Q40 58 80 63" stroke="#C8A855" strokeWidth="0.6" fill="none" opacity="0.3" />
      </pattern>

      {/* ── MEAT GRADIENTS ─────────────────────────────────────────────── */}
      <linearGradient id="prosciuttoFill" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"  stopColor="#D4827A" />
        <stop offset="50%" stopColor="#C4706B" />
        <stop offset="100%" stopColor="#A85850" />
      </linearGradient>

      <linearGradient id="serranoFill" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"  stopColor="#C87870" />
        <stop offset="100%" stopColor="#A06058" />
      </linearGradient>

      <radialGradient id="salamiRosetteFill" cx="35%" cy="35%" r="65%">
        <stop offset="0%"  stopColor="#A04848" />
        <stop offset="60%" stopColor="#8B3A3A" />
        <stop offset="100%" stopColor="#6A2828" />
      </radialGradient>

      <radialGradient id="coppaFill" cx="35%" cy="35%" r="65%">
        <stop offset="0%"  stopColor="#C87060" />
        <stop offset="60%" stopColor="#B05848" />
        <stop offset="100%" stopColor="#884038" />
      </radialGradient>

      {/* ── CHEESE GRADIENTS ───────────────────────────────────────────── */}
      <radialGradient id="brieFill" cx="40%" cy="35%" r="70%">
        <stop offset="0%"  stopColor="#F8F0DC" />
        <stop offset="60%" stopColor="#F0E4C0" />
        <stop offset="100%" stopColor="#D8C890" />
      </radialGradient>

      <radialGradient id="manchegoFill" cx="40%" cy="35%" r="70%">
        <stop offset="0%"  stopColor="#F0D878" />
        <stop offset="60%" stopColor="#E8C855" />
        <stop offset="100%" stopColor="#C8A030" />
      </radialGradient>

      <radialGradient id="goudaFill" cx="30%" cy="30%" r="80%">
        <stop offset="0%"  stopColor="#F8D870" />
        <stop offset="50%" stopColor="#F0C84A" />
        <stop offset="100%" stopColor="#D4A025" />
      </radialGradient>

      <radialGradient id="cheddarFill" cx="35%" cy="35%" r="70%">
        <stop offset="0%"  stopColor="#F0A855" />
        <stop offset="60%" stopColor="#E09040" />
        <stop offset="100%" stopColor="#C07028" />
      </radialGradient>

      <radialGradient id="goatFill" cx="40%" cy="35%" r="70%">
        <stop offset="0%"  stopColor="#F8F4EC" />
        <stop offset="60%" stopColor="#F0EAD8" />
        <stop offset="100%" stopColor="#E0D8C0" />
      </radialGradient>

      <radialGradient id="boursinFill" cx="45%" cy="40%" r="65%">
        <stop offset="0%"  stopColor="#FDFAF2" />
        <stop offset="60%" stopColor="#F2EDE0" />
        <stop offset="100%" stopColor="#E5DFC8" />
      </radialGradient>

      <radialGradient id="humboldtFill" cx="40%" cy="35%" r="70%">
        <stop offset="0%"  stopColor="#F5F0E8" />
        <stop offset="45%" stopColor="#E8E0D0" />
        <stop offset="46%" stopColor="#4A4A4A" />  {/* ash line */}
        <stop offset="54%" stopColor="#4A4A4A" />
        <stop offset="55%" stopColor="#E8E0D0" />
        <stop offset="100%" stopColor="#D8D0B8" />
      </radialGradient>

      {/* ── FRUIT GRADIENTS ────────────────────────────────────────────── */}
      <radialGradient id="greenGrapeFill" cx="35%" cy="30%" r="70%">
        <stop offset="0%"  stopColor="#C8E888" />
        <stop offset="60%" stopColor="#8FBA5E" />
        <stop offset="100%" stopColor="#6A9038" />
      </radialGradient>

      <radialGradient id="redGrapeFill" cx="35%" cy="30%" r="70%">
        <stop offset="0%"  stopColor="#CC6870" />
        <stop offset="60%" stopColor="#A03848" />
        <stop offset="100%" stopColor="#782030" />
      </radialGradient>

      <radialGradient id="strawberryFill" cx="40%" cy="30%" r="70%">
        <stop offset="0%"  stopColor="#FF6878" />
        <stop offset="60%" stopColor="#E83848" />
        <stop offset="100%" stopColor="#C01830" />
      </radialGradient>

      <radialGradient id="blueberryFill" cx="35%" cy="30%" r="70%">
        <stop offset="0%"  stopColor="#8088CC" />
        <stop offset="60%" stopColor="#4858A8" />
        <stop offset="100%" stopColor="#303880" />
      </radialGradient>

      <radialGradient id="raspberryFill" cx="40%" cy="30%" r="70%">
        <stop offset="0%"  stopColor="#F07080" />
        <stop offset="60%" stopColor="#D04060" />
        <stop offset="100%" stopColor="#A82040" />
      </radialGradient>

      <radialGradient id="blackberryFill" cx="35%" cy="30%" r="70%">
        <stop offset="0%"  stopColor="#605880" />
        <stop offset="60%" stopColor="#403060" />
        <stop offset="100%" stopColor="#281840" />
      </radialGradient>

      <radialGradient id="mandarinFill" cx="40%" cy="35%" r="65%">
        <stop offset="0%"  stopColor="#FFB060" />
        <stop offset="60%" stopColor="#F07820" />
        <stop offset="100%" stopColor="#D05808" />
      </radialGradient>

      <radialGradient id="kiwiFill" cx="40%" cy="40%" r="60%">
        <stop offset="0%"  stopColor="#88C848" />
        <stop offset="60%" stopColor="#58A020" />
        <stop offset="100%" stopColor="#388010" />
      </radialGradient>

      {/* ── DRAGON FRUIT — Signature CO Visual Hero ────────────────────── */}
      <radialGradient id="dragonFruitSkin" cx="50%" cy="50%" r="50%">
        <stop offset="0%"  stopColor="#FF4A7A" />
        <stop offset="70%" stopColor="#E8205A" />
        <stop offset="100%" stopColor="#C00848" />
      </radialGradient>

      <radialGradient id="dragonFruitInterior" cx="50%" cy="50%" r="50%">
        <stop offset="0%"  stopColor="#FFFFFF" />
        <stop offset="80%" stopColor="#F8F0F0" />
        <stop offset="100%" stopColor="#F0E8E8" />
      </radialGradient>

      {/* ── ACCOUTREMENTS ──────────────────────────────────────────────── */}
      <radialGradient id="pistachioFill" cx="40%" cy="35%" r="70%">
        <stop offset="0%"  stopColor="#D8E898" />
        <stop offset="60%" stopColor="#A8C860" />
        <stop offset="100%" stopColor="#78A030" />
      </radialGradient>

      <radialGradient id="walnutFill" cx="35%" cy="30%" r="70%">
        <stop offset="0%"  stopColor="#C09868" />
        <stop offset="60%" stopColor="#987040" />
        <stop offset="100%" stopColor="#705020" />
      </radialGradient>

      <radialGradient id="cornichonFill" cx="40%" cy="35%" r="65%">
        <stop offset="0%"  stopColor="#98C870" />
        <stop offset="60%" stopColor="#6B9040" />
        <stop offset="100%" stopColor="#4A6828" />
      </radialGradient>

      <radialGradient id="oliveFill" cx="40%" cy="35%" r="65%">
        <stop offset="0%"  stopColor="#A8C870" />
        <stop offset="60%" stopColor="#7A9840" />
        <stop offset="100%" stopColor="#587020" />
      </radialGradient>

      {/* ── JAR GRADIENTS ──────────────────────────────────────────────── */}
      <linearGradient id="jamJarBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"  stopColor="#E8584A" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#C03828" stopOpacity="0.9" />
      </linearGradient>

      <linearGradient id="honeyJarBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"  stopColor="#F0C848" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#C89818" stopOpacity="0.95" />
      </linearGradient>

      <linearGradient id="jarGlass" x1="0%" y1="0%" x2="30%" y2="100%">
        <stop offset="0%"  stopColor="#FFFFFF" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
      </linearGradient>

      {/* ── CHOCOLATE ──────────────────────────────────────────────────── */}
      <radialGradient id="chocolateFill" cx="35%" cy="30%" r="70%">
        <stop offset="0%"  stopColor="#6A4020" />
        <stop offset="60%" stopColor="#4A2810" />
        <stop offset="100%" stopColor="#301808" />
      </radialGradient>

      {/* ── DROP SHADOW FILTER ─────────────────────────────────────────── */}
      <filter id="ingredientShadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="1" dy="2" stdDeviation="3" floodColor="#2D1A00" floodOpacity="0.25" />
      </filter>

      <filter id="softShadow" x="-15%" y="-15%" width="130%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#2D1A00" floodOpacity="0.18" />
      </filter>

      <filter id="jarShadow" x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx="2" dy="4" stdDeviation="6" floodColor="#1A0800" floodOpacity="0.30" />
      </filter>

      {/* ── BOARD VIGNETTE ─────────────────────────────────────────────── */}
      <radialGradient id="boardVignette" cx="50%" cy="50%" r="70%">
        <stop offset="60%" stopColor="#000000" stopOpacity="0" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.12" />
      </radialGradient>
    </defs>
  );
}
