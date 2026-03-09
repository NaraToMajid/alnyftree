/* ============================================================
   ALNYFTREE — Advanced Linktree Builder
   script.js — Main Application Logic
   ============================================================ */

// ─── SUPABASE CONFIG ──────────────────────────────────────────
const SUPABASE_URL = 'https://mqonelsoqyvrasrzrzfl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xb25lbHNvcXl2cmFzcnpyemZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NjEzOTQsImV4cCI6MjA4MTUzNzM5NH0.exHvN0BA3P71DcZbavZ0DMk8pUEpWQ6VCuH672wEdJ4';
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── APP STATE ────────────────────────────────────────────────
let currentUser = null;
let currentProfile = null;
let allTemplates = [];
let currentPage = 1;
const TEMPLATES_PER_PAGE = 60;
let currentTemplateFilter = 'all';
let templateSearch = '';
let dragSrcEl = null;
let currentMusic = null;
let isPlaying = false;
let musicInterval = null;
let complainType = 'saran';
let editingLinkId = null;
let selectedIcon = 'fas fa-link'; // Default Font Awesome icon
let selectedButtonStyle = 'rounded';
let adminEditUserId = null;

// ─── TEMPLATE CATEGORIES & DATA ───────────────────────────────
const TEMPLATE_CATEGORIES = [
  'all','minimalis','dark','neon','gradient','nature','retro','luxury',
  'pastel','brutalist','glassmorphism','editorial','anime','gaming',
  'music','travel','food','fashion','tech','art','ocean','space',
  'vintage','floral','monochrome'
];

// ─── FONT AWESOME ICONS ───────────────────────────────────────
const FONT_AWESOME_ICONS = [
  'fas fa-link', 'fas fa-globe', 'fas fa-mobile-alt', 'fas fa-laptop', 'fas fa-envelope',
  'fab fa-instagram', 'fab fa-facebook', 'fab fa-twitter', 'fab fa-youtube', 'fab fa-tiktok',
  'fab fa-whatsapp', 'fab fa-telegram', 'fab fa-discord', 'fab fa-github', 'fab fa-linkedin',
  'fab fa-spotify', 'fab fa-soundcloud', 'fab fa-apple', 'fab fa-google', 'fab fa-amazon',
  'fas fa-shopping-cart', 'fas fa-store', 'fas fa-dollar-sign', 'fas fa-credit-card',
  'fas fa-music', 'fas fa-headphones', 'fas fa-podcast', 'fas fa-video', 'fas fa-film',
  'fas fa-camera', 'fas fa-image', 'fas fa-paint-brush', 'fas fa-pen', 'fas fa-book',
  'fas fa-graduation-cap', 'fas fa-school', 'fas fa-university', 'fas fa-chart-line',
  'fas fa-chart-bar', 'fas fa-chart-pie', 'fas fa-calculator', 'fas fa-clock',
  'fas fa-calendar', 'fas fa-bell', 'fas fa-heart', 'fas fa-star', 'fas fa-fire',
  'fas fa-bolt', 'fas fa-cloud', 'fas fa-sun', 'fas fa-moon', 'fas fa-tree',
  'fas fa-leaf', 'fas fa-seedling', 'fas fa-flower', 'fas fa-paw', 'fas fa-cat',
  'fas fa-dog', 'fas fa-hippo', 'fas fa-fish', 'fas fa-dragon', 'fas fa-robot',
  'fas fa-gamepad', 'fas fa-chess', 'fas fa-dice', 'fas fa-crown', 'fas fa-gem',
  'fas fa-coffee', 'fas fa-utensils', 'fas fa-pizza', 'fas fa-hamburger', 'fas fa-beer',
  'fas fa-cocktail', 'fas fa-wine-glass', 'fas fa-glass-cheers', 'fas fa-bus',
  'fas fa-car', 'fas fa-plane', 'fas fa-train', 'fas fa-bicycle', 'fas fa-walking',
  'fas fa-running', 'fas fa-swimmer', 'fas fa-basketball-ball', 'fas fa-football-ball',
  'fas fa-volleyball-ball', 'fas fa-baseball-ball', 'fas fa-golf-ball', 'fas fa-table-tennis',
  'fas fa-bowling-ball', 'fas fa-medal', 'fas fa-trophy', 'fas fa-award', 'fas fa-ribbon'
];

const EMOJI_ICONS = [
  '🔗','🌐','📱','💻','📧','📷','📸','🎵','🎬','📺',
  '🐦','📘','📷','▶️','💼','🐙','📌','💬','✈️','🎶',
  '🎮','🎯','📝','📚','🎨','🏆','💡','🔥','⭐','💎',
  '🚀','🌟','🎪','🎭','🎤','🎧','🖥️','📡','🛒','💰',
  '🎁','🏠','🚗','✈️','🌍','❤️','💙','💚','💜','🧡',
  '💛','🤍','🖤','🤎','💗','💖','👤','👥','🤝','💪',
  '🙌','👏','✌️','🤙','👌','🔑','🔒','🔓','⚙️','🛠️',
  '📊','📈','📉','💹','🗓️','⏰','📌','📍','🗺️','🧭',
  '🏅','🥇','🥈','🥉','🎖️','🏵️','🎫','🎟️','🎪','🎭',
  '🎨','🎬','🎤','🎧','🎼','🎹','🥁','🎷','🎸','🎺'
];

const SOCIAL_PRESETS = [
  { icon:'fab fa-instagram', label:'Instagram', prefix:'https://instagram.com/' },
  { icon:'fab fa-facebook', label:'Facebook', prefix:'https://facebook.com/' },
  { icon:'fab fa-twitter', label:'Twitter/X', prefix:'https://x.com/' },
  { icon:'fab fa-youtube', label:'YouTube', prefix:'https://youtube.com/@' },
  { icon:'fab fa-linkedin', label:'LinkedIn', prefix:'https://linkedin.com/in/' },
  { icon:'fab fa-tiktok', label:'TikTok', prefix:'https://tiktok.com/@' },
  { icon:'fab fa-whatsapp', label:'WhatsApp', prefix:'https://wa.me/' },
  { icon:'fab fa-telegram', label:'Telegram', prefix:'https://t.me/' },
  { icon:'fab fa-github', label:'GitHub', prefix:'https://github.com/' },
  { icon:'fab fa-spotify', label:'Spotify', prefix:'https://open.spotify.com/user/' },
  { icon:'fab fa-discord', label:'Discord', prefix:'https://discord.gg/' },
  { icon:'fab fa-snapchat', label:'Snapchat', prefix:'https://snapchat.com/add/' },
  { icon:'fab fa-pinterest', label:'Pinterest', prefix:'https://pinterest.com/' },
  { icon:'fab fa-medium', label:'Medium', prefix:'https://medium.com/@' },
  { icon:'fab fa-twitch', label:'Twitch', prefix:'https://twitch.tv/' },
  { icon:'fas fa-envelope', label:'Email', prefix:'mailto:' },
  { icon:'fas fa-globe', label:'Website', prefix:'https://' },
  { icon:'fas fa-store', label:'Toko Online', prefix:'https://' },
  { icon:'fas fa-music', label:'Musik', prefix:'https://' },
  { icon:'fas fa-video', label:'Video', prefix:'https://' }
];

const FONT_OPTIONS = [
  { name: 'Syne', display: 'Syne', family: "'Syne', sans-serif" },
  { name: 'Playfair Display', display: 'Playfair', family: "'Playfair Display', serif" },
  { name: 'Bebas Neue', display: 'BEBAS NEUE', family: "'Bebas Neue', cursive" },
  { name: 'Abril Fatface', display: 'Abril Fatface', family: "'Abril Fatface', cursive" },
  { name: 'Josefin Sans', display: 'Josefin Sans', family: "'Josefin Sans', sans-serif" },
  { name: 'Cinzel', display: 'Cinzel', family: "'Cinzel', serif" },
  { name: 'Space Mono', display: 'Space Mono', family: "'Space Mono', monospace" },
  { name: 'Righteous', display: 'Righteous', family: "'Righteous', cursive" },
  { name: 'Lobster', display: 'Lobster', family: "'Lobster', cursive" },
  { name: 'Pacifico', display: 'Pacifico', family: "'Pacifico', cursive" },
  { name: 'Dancing Script', display: 'Dancing Script', family: "'Dancing Script', cursive" },
  { name: 'Satisfy', display: 'Satisfy', family: "'Satisfy', cursive" },
  { name: 'Fredoka One', display: 'Fredoka One', family: "'Fredoka One', cursive" },
  { name: 'Permanent Marker', display: 'Marker', family: "'Permanent Marker', cursive" },
  { name: 'Raleway', display: 'Raleway', family: "'Raleway', sans-serif" },
  { name: 'DM Sans', display: 'DM Sans', family: "'DM Sans', sans-serif" },
];

const BTN_STYLE_OPTIONS = [
  { id: 'pill', label: 'Pill', radius: '99px', outline: false },
  { id: 'rounded', label: 'Rounded', radius: '16px', outline: false },
  { id: 'square', label: 'Square', radius: '6px', outline: false },
  { id: 'sharp', label: 'Sharp', radius: '0px', outline: false },
  { id: 'outline-pill', label: 'Outline Pill', radius: '99px', outline: true },
  { id: 'outline-rounded', label: 'Outline', radius: '16px', outline: true },
  { id: 'shadow', label: 'Shadow', radius: '16px', shadow: true },
  { id: 'brutalist', label: 'Brutalist', radius: '0px', brutalist: true },
  { id: 'glass', label: 'Glass', radius: '16px', glass: true },
];

const ACCENT_COLORS = [
  '#7c5cfc','#e040fb','#00e5ff','#00e676','#ff1744','#ffd740',
  '#ff6d00','#64dd17','#00b0ff','#d500f9','#ffab00','#00bfa5',
  '#ff4081','#40c4ff','#69f0ae','#eeff41','#ff6e40','#ea80fc',
  '#ffffff','#000000','#cccccc','#888888','#ff5252','#1de9b6',
];

// ─── FULL TEMPLATE LIBRARY (1000+ templates) ─────────────────
function generateTemplates() {
  const tpl = [];
  let id = 1;

  const palettes = [
    // Dark themes
    { bg:'#0a0a0f', card:'#1c1c28', text:'#f0f0f8', accent:'#7c5cfc', cat:'dark' },
    { bg:'#0d0d0d', card:'#1a1a1a', text:'#e0e0e0', accent:'#ff3d00', cat:'dark' },
    { bg:'#070712', card:'#11112a', text:'#ccc6ff', accent:'#4a90e2', cat:'dark' },
    { bg:'#0f0f10', card:'#1e1e20', text:'#f5f5f5', accent:'#00e5ff', cat:'dark' },
    { bg:'#0b0b12', card:'#161623', text:'#ebe8ff', accent:'#e040fb', cat:'dark' },
    { bg:'#0e0e0e', card:'#1a1a1a', text:'#f0f0f0', accent:'#76ff03', cat:'dark' },
    { bg:'#060609', card:'#12121f', text:'#d8d8f0', accent:'#ffd740', cat:'dark' },
    { bg:'#060a14', card:'#0d1826', text:'#b8d4ff', accent:'#00b0ff', cat:'dark' },
    // Neon themes
    { bg:'#03001e', card:'#0a0030', text:'#ffffff', accent:'#ff00ff', cat:'neon', neon:true },
    { bg:'#000a05', card:'#001a0a', text:'#ccffcc', accent:'#00ff88', cat:'neon', neon:true },
    { bg:'#050020', card:'#0f0040', text:'#e0ccff', accent:'#cc00ff', cat:'neon', neon:true },
    { bg:'#0a1a00', card:'#142600', text:'#ccff00', accent:'#aaff00', cat:'neon', neon:true },
    { bg:'#00101e', card:'#001a2e', text:'#00eeff', accent:'#00ddff', cat:'neon', neon:true },
    { bg:'#1a0010', card:'#2e0020', text:'#ffccee', accent:'#ff2288', cat:'neon', neon:true },
    // Minimalis themes
    { bg:'#ffffff', card:'#f5f5f5', text:'#111111', accent:'#000000', cat:'minimalis' },
    { bg:'#fafafa', card:'#f0f0f0', text:'#222222', accent:'#333333', cat:'minimalis' },
    { bg:'#f8f8f2', card:'#eeeeee', text:'#1a1a1a', accent:'#555555', cat:'minimalis' },
    { bg:'#fff9f5', card:'#f5ece4', text:'#3d2c1e', accent:'#8b5e3c', cat:'minimalis' },
    { bg:'#f5f8ff', card:'#e8eeff', text:'#1a2060', accent:'#3355cc', cat:'minimalis' },
    { bg:'#f4fff4', card:'#e6f9e6', text:'#1a3d1a', accent:'#228b22', cat:'minimalis' },
    { bg:'#fff5f5', card:'#ffe8e8', text:'#5c1a1a', accent:'#cc2200', cat:'minimalis' },
    { bg:'#fffdf0', card:'#faf6d8', text:'#4a3c00', accent:'#b8860b', cat:'minimalis' },
    // Gradient themes  
    { bg:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)', card:'rgba(255,255,255,0.15)', text:'#fff', accent:'#ffd700', cat:'gradient' },
    { bg:'linear-gradient(135deg,#f093fb 0%,#f5576c 100%)', card:'rgba(255,255,255,0.15)', text:'#fff', accent:'#ffeb3b', cat:'gradient' },
    { bg:'linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)', card:'rgba(255,255,255,0.15)', text:'#fff', accent:'#ffffff', cat:'gradient' },
    { bg:'linear-gradient(135deg,#43e97b 0%,#38f9d7 100%)', card:'rgba(255,255,255,0.15)', text:'#fff', accent:'#ffffff', cat:'gradient' },
    { bg:'linear-gradient(135deg,#fa709a 0%,#fee140 100%)', card:'rgba(255,255,255,0.15)', text:'#fff', accent:'#ffffff', cat:'gradient' },
    { bg:'linear-gradient(135deg,#a18cd1 0%,#fbc2eb 100%)', card:'rgba(255,255,255,0.15)', text:'#fff', accent:'#ffffff', cat:'gradient' },
    { bg:'linear-gradient(135deg,#ffecd2 0%,#fcb69f 100%)', card:'rgba(255,255,255,0.12)', text:'#5c2d00', accent:'#c0392b', cat:'gradient' },
    { bg:'linear-gradient(135deg,#a1c4fd 0%,#c2e9fb 100%)', card:'rgba(255,255,255,0.18)', text:'#1a3060', accent:'#1565c0', cat:'gradient' },
    { bg:'linear-gradient(135deg,#d4fc79 0%,#96e6a1 100%)', card:'rgba(255,255,255,0.15)', text:'#1a4020', accent:'#2e7d32', cat:'gradient' },
    { bg:'linear-gradient(135deg,#30cfd0 0%,#330867 100%)', card:'rgba(255,255,255,0.1)', text:'#e0ddff', accent:'#ff80ff', cat:'gradient' },
    // Nature
    { bg:'#1a2f0a', card:'#2a4a12', text:'#d4ffc4', accent:'#7dff4a', cat:'nature' },
    { bg:'#0a2010', card:'#144228', text:'#c0fcd8', accent:'#00e676', cat:'nature' },
    { bg:'#f5f0e8', card:'#e8dcc8', text:'#4a3420', accent:'#8b6914', cat:'nature' },
    { bg:'#e8f4e8', card:'#d4ead4', text:'#1a3020', accent:'#2e7d32', cat:'nature' },
    { bg:'#f0e8d0', card:'#e4d8bc', text:'#3d2808', accent:'#6d4c41', cat:'nature' },
    { bg:'#0d1f0d', card:'#1a3a1a', text:'#a0ffa0', accent:'#4cff4c', cat:'nature' },
    // Pastel
    { bg:'#fce4ec', card:'#f8bbd0', text:'#880e4f', accent:'#e91e63', cat:'pastel' },
    { bg:'#e8eaf6', card:'#c5cae9', text:'#1a237e', accent:'#3f51b5', cat:'pastel' },
    { bg:'#e0f7fa', card:'#b2ebf2', text:'#006064', accent:'#00bcd4', cat:'pastel' },
    { bg:'#f3e5f5', card:'#e1bee7', text:'#4a148c', accent:'#9c27b0', cat:'pastel' },
    { bg:'#fff8e1', card:'#ffecb3', text:'#f57f17', accent:'#ffc107', cat:'pastel' },
    { bg:'#e8f5e9', card:'#c8e6c9', text:'#1b5e20', accent:'#4caf50', cat:'pastel' },
    { bg:'#fff3e0', card:'#ffe0b2', text:'#bf360c', accent:'#ff5722', cat:'pastel' },
    { bg:'#fafce8', card:'#f0f4c3', text:'#33691e', accent:'#8bc34a', cat:'pastel' },
    // Retro
    { bg:'#2b1d0e', card:'#3d2914', text:'#f0c060', accent:'#ff9800', cat:'retro' },
    { bg:'#1a0a2e', card:'#2e1040', text:'#ff80ff', accent:'#ff00ff', cat:'retro' },
    { bg:'#0a1a0a', card:'#0f280f', text:'#00ff00', accent:'#00cc00', cat:'retro' },
    { bg:'#f5e6c8', card:'#ecdbb0', text:'#3d2808', accent:'#8b4513', cat:'retro' },
    { bg:'#fff0d8', card:'#ffe4b4', text:'#5c3000', accent:'#c0392b', cat:'retro' },
    // Luxury
    { bg:'#0a0803', card:'#1a1408', text:'#d4af37', accent:'#d4af37', cat:'luxury' },
    { bg:'#0d0d0d', card:'#1a1a1a', text:'#c0a860', accent:'#c0a860', cat:'luxury' },
    { bg:'#080810', card:'#101018', text:'#e8d5b7', accent:'#c9a96e', cat:'luxury' },
    { bg:'#0a0a14', card:'#14142a', text:'#f0e8d8', accent:'#b8965a', cat:'luxury' },
    { bg:'#f5f0e8', card:'#e8e0d0', text:'#3d2808', accent:'#8b6914', cat:'luxury' },
    // Glassmorphism
    { bg:'linear-gradient(135deg,#667eea,#764ba2)', card:'rgba(255,255,255,0.1)', text:'#fff', accent:'#fff', cat:'glassmorphism', glass:true },
    { bg:'linear-gradient(135deg,#00c6ff,#0072ff)', card:'rgba(255,255,255,0.1)', text:'#fff', accent:'#fff', cat:'glassmorphism', glass:true },
    { bg:'linear-gradient(135deg,#f093fb,#f5576c)', card:'rgba(255,255,255,0.1)', text:'#fff', accent:'#fff', cat:'glassmorphism', glass:true },
    { bg:'linear-gradient(135deg,#43e97b,#38f9d7)', card:'rgba(255,255,255,0.1)', text:'#fff', accent:'#fff', cat:'glassmorphism', glass:true },
    // Brutalist
    { bg:'#f5f500', card:'#000000', text:'#f5f500', accent:'#ff0000', cat:'brutalist' },
    { bg:'#ff3300', card:'#000000', text:'#ffff00', accent:'#00ff00', cat:'brutalist' },
    { bg:'#000000', card:'#f0f0f0', text:'#000000', accent:'#ff3300', cat:'brutalist' },
    { bg:'#0000ff', card:'#ffff00', text:'#ff0000', accent:'#00ff00', cat:'brutalist' },
    // Anime
    { bg:'#ffeef8', card:'#ffd8f0', text:'#4a0040', accent:'#ff69b4', cat:'anime' },
    { bg:'#e8f4ff', card:'#cce4ff', text:'#002060', accent:'#4499ff', cat:'anime' },
    { bg:'#fff0e0', card:'#ffe0c8', text:'#5c1a00', accent:'#ff6633', cat:'anime' },
    { bg:'#f0fff0', card:'#d8ffd8', text:'#003300', accent:'#33cc00', cat:'anime' },
    // Gaming
    { bg:'#001a40', card:'#002a60', text:'#60ffff', accent:'#00ffff', cat:'gaming' },
    { bg:'#0a001a', card:'#14002e', text:'#ff80ff', accent:'#ff00ff', cat:'gaming' },
    { bg:'#001a00', card:'#002a00', text:'#00ff60', accent:'#00ff00', cat:'gaming' },
    { bg:'#1a0a00', card:'#2a1400', text:'#ff8000', accent:'#ff6600', cat:'gaming' },
    { bg:'#0a0020', card:'#14003a', text:'#80ffff', accent:'#00e5ff', cat:'gaming' },
    // Music
    { bg:'#0a0014', card:'#140024', text:'#e0c0ff', accent:'#cc44ff', cat:'music' },
    { bg:'#1a0000', card:'#2e0000', text:'#ffc0c0', accent:'#ff4444', cat:'music' },
    { bg:'#001420', card:'#002030', text:'#c0e0ff', accent:'#44aaff', cat:'music' },
    // Travel
    { bg:'#001f3f', card:'#003060', text:'#b0d8ff', accent:'#0099ff', cat:'travel' },
    { bg:'#f8f4e8', card:'#f0e8d0', text:'#3d2800', accent:'#e8a020', cat:'travel' },
    { bg:'#e8f4f8', card:'#d0e8f0', text:'#1a3040', accent:'#0099bb', cat:'travel' },
    // Fashion
    { bg:'#1a0020', card:'#2a0030', text:'#f0c0ff', accent:'#dd44ff', cat:'fashion' },
    { bg:'#faf0e8', card:'#f0e4d4', text:'#3d2010', accent:'#cc6633', cat:'fashion' },
    { bg:'#0a0a0a', card:'#1a1a1a', text:'#ffffff', accent:'#ff44aa', cat:'fashion' },
    // Tech
    { bg:'#000a20', card:'#001030', text:'#80c0ff', accent:'#0066ff', cat:'tech' },
    { bg:'#001400', card:'#002000', text:'#80ff80', accent:'#00cc00', cat:'tech' },
    { bg:'#0d0d0d', card:'#1c1c1c', text:'#00ff44', accent:'#00cc44', cat:'tech' },
    // Ocean
    { bg:'#001a2e', card:'#002840', text:'#80d4ff', accent:'#00aaff', cat:'ocean' },
    { bg:'#002040', card:'#003060', text:'#aae0ff', accent:'#00bbff', cat:'ocean' },
    { bg:'#e8f8ff', card:'#d0f0ff', text:'#003060', accent:'#0088cc', cat:'ocean' },
    // Space
    { bg:'#02001a', card:'#06003a', text:'#c8b0ff', accent:'#8844ff', cat:'space' },
    { bg:'#000814', card:'#001428', text:'#a0c8ff', accent:'#4488ff', cat:'space' },
    { bg:'#080010', card:'#100020', text:'#e0d0ff', accent:'#aa66ff', cat:'space' },
    // Vintage
    { bg:'#f5e6c8', card:'#e8d0a8', text:'#5c3000', accent:'#8b5a00', cat:'vintage' },
    { bg:'#f0e0c0', card:'#e0c8a0', text:'#4a2800', accent:'#6b4000', cat:'vintage' },
    { bg:'#e8dcc8', card:'#d8c8a8', text:'#3d2000', accent:'#5c3a00', cat:'vintage' },
    // Floral
    { bg:'#fff5f8', card:'#ffe0ec', text:'#5c0030', accent:'#ff2277', cat:'floral' },
    { bg:'#f5fff5', card:'#e0ffe0', text:'#003300', accent:'#22aa22', cat:'floral' },
    { bg:'#fffbf0', card:'#fff0d0', text:'#4a2800', accent:'#e8901a', cat:'floral' },
    // Art
    { bg:'#1a1a2e', card:'#16213e', text:'#e0e0ff', accent:'#e94560', cat:'art' },
    { bg:'#2d0028', card:'#460040', text:'#ffd4f8', accent:'#ff44dd', cat:'art' },
    { bg:'#f0ece0', card:'#e4dcc8', text:'#2a1a00', accent:'#c0661a', cat:'art' },
    // Editorial
    { bg:'#ffffff', card:'#000000', text:'#ffffff', accent:'#ff3300', cat:'editorial' },
    { bg:'#000000', card:'#ffffff', text:'#000000', accent:'#0000ff', cat:'editorial' },
    { bg:'#f5f5f5', card:'#1a1a1a', text:'#f5f5f5', accent:'#ffcc00', cat:'editorial' },
    // Food
    { bg:'#fff3e0', card:'#ffe0b2', text:'#5c2800', accent:'#e64a19', cat:'food' },
    { bg:'#f1f8e9', card:'#dcedc8', text:'#1b5e20', accent:'#558b2f', cat:'food' },
    { bg:'#fce4ec', card:'#f8bbd0', text:'#880e4f', accent:'#c62828', cat:'food' },
    // Monochrome
    { bg:'#0a0a0a', card:'#1a1a1a', text:'#888888', accent:'#ffffff', cat:'monochrome' },
    { bg:'#f5f5f5', card:'#e5e5e5', text:'#444444', accent:'#000000', cat:'monochrome' },
    { bg:'#888888', card:'#999999', text:'#ffffff', accent:'#111111', cat:'monochrome' },
  ];

  const fontPairs = [
    { heading: "'Syne', sans-serif", body: "'DM Sans', sans-serif", name: 'Syne / DM Sans' },
    { heading: "'Playfair Display', serif", body: "'DM Sans', sans-serif", name: 'Playfair / DM Sans' },
    { heading: "'Bebas Neue', cursive", body: "'Raleway', sans-serif", name: 'Bebas / Raleway' },
    { heading: "'Abril Fatface', cursive", body: "'DM Sans', sans-serif", name: 'Abril / DM Sans' },
    { heading: "'Josefin Sans', sans-serif", body: "'DM Sans', sans-serif", name: 'Josefin / DM Sans' },
    { heading: "'Cinzel', serif", body: "'DM Sans', sans-serif", name: 'Cinzel / DM Sans' },
    { heading: "'Space Mono', monospace", body: "'Space Mono', monospace", name: 'Space Mono' },
    { heading: "'Righteous', cursive", body: "'DM Sans', sans-serif", name: 'Righteous / DM Sans' },
    { heading: "'Lobster', cursive", body: "'DM Sans', sans-serif", name: 'Lobster / DM Sans' },
    { heading: "'Pacifico', cursive", body: "'DM Sans', sans-serif", name: 'Pacifico / DM Sans' },
    { heading: "'Dancing Script', cursive", body: "'DM Sans', sans-serif", name: 'Dancing / DM Sans' },
    { heading: "'Satisfy', cursive", body: "'DM Sans', sans-serif", name: 'Satisfy / DM Sans' },
    { heading: "'Fredoka One', cursive", body: "'DM Sans', sans-serif", name: 'Fredoka / DM Sans' },
    { heading: "'Permanent Marker', cursive", body: "'DM Sans', sans-serif", name: 'Marker / DM Sans' },
    { heading: "'Raleway', sans-serif", body: "'DM Sans', sans-serif", name: 'Raleway / DM Sans' },
  ];

  const btnStyles = [
    { radius: '99px', shadow: '0 4px 16px rgba(0,0,0,0.3)' },
    { radius: '16px', shadow: '0 4px 12px rgba(0,0,0,0.2)' },
    { radius: '6px', shadow: 'none', border: '2px solid' },
    { radius: '0px', shadow: '4px 4px 0 rgba(0,0,0,0.8)', border: '2px solid' },
    { radius: '20px', shadow: '0 8px 24px rgba(0,0,0,0.15)' },
    { radius: '2px', shadow: 'inset 0 0 0 2px', border: 'none' },
    { radius: '50px', shadow: '0 2px 8px rgba(0,0,0,0.2)', outline: true },
    { radius: '12px', shadow: '0 6px 20px rgba(0,0,0,0.25)' },
  ];

  const avatarStyles = ['circle','square','hexagon','squircle'];
  const bgEffects = ['none','dots','lines','grid','waves','blobs'];
  const templateNames = [
    'Midnight','Aurora','Cosmos','Ember','Glacier','Prism','Nova','Eclipse',
    'Zenith','Horizon','Neon City','Carbon','Silk','Storm','Dusk','Dawn',
    'Solstice','Radiant','Pulse','Orbit','Catalyst','Vapor','Ghost','Mirror',
    'Cascade','Flux','Crystal','Vortex','Lunar','Solar','Nebula','Comet',
    'Quartz','Obsidian','Onyx','Ivory','Jade','Ruby','Topaz','Amber',
    'Sapphire','Emerald','Amethyst','Pearl','Coral','Teal','Indigo','Scarlet',
    'Vivid','Muted','Bold','Soft','Sharp','Clean','Raw','Pure',
    'Edge','Flow','Drift','Surge','Wave','Tide','Breeze','Storm',
    'Forest','Ocean','Desert','Arctic','Tropics','Prairie','Canyon','Summit',
    'Metro','Urban','Rural','Coastal','Highland','Valley','Plateau','Ridge',
    'Neon','Hologram','Glitch','Pixel','Vector','Binary','Circuit','Matrix',
    'Baroque','Gothic','Art Deco','Bauhaus','Pop Art','Cubist','Futurist','Dadaist',
    'Spring','Summer','Autumn','Winter','Monsoon','Solstice','Equinox','Zenith',
    'Jazz','Blues','Rock','Pop','Electronic','Classical','Folk','Hip-Hop',
    'Tokyo','Paris','NYC','London','Seoul','Milan','Dubai','Bali',
    'Ramen','Sakura','Koi','Torii','Lantern','Kimono','Zen','Fuji',
    'Eiffel','Croissant','Beret','Moulin','Versailles','Louvre','Champs','Seine',
    'Skyline','Downtown','Uptown','Midtown','Suburb','Rooftop','Penthouse','Loft',
  ];

  // Generate 1000+ unique templates
  let nameIdx = 0;
  for (let pi = 0; pi < palettes.length; pi++) {
    for (let fi = 0; fi < fontPairs.length; fi++) {
      for (let bi = 0; bi < btnStyles.length; bi++) {
        if (tpl.length >= 1200) break;
        const palette = palettes[pi];
        const font = fontPairs[fi % fontPairs.length];
        const btn = btnStyles[bi % btnStyles.length];
        const avatarStyle = avatarStyles[(pi + fi) % avatarStyles.length];
        const bgEffect = bgEffects[(pi + fi + bi) % bgEffects.length];
        const name = templateNames[nameIdx % templateNames.length] + (nameIdx >= templateNames.length ? ' ' + (Math.floor(nameIdx / templateNames.length) + 1) : '');
        nameIdx++;

        tpl.push({
          id: id++,
          name: name,
          category: palette.cat,
          palette: palette,
          font: font,
          btn: btn,
          avatarStyle,
          bgEffect,
          glass: !!palette.glass,
          neon: !!palette.neon,
          previewGradient: generatePreviewGradient(palette),
        });
      }
      if (tpl.length >= 1200) break;
    }
    if (tpl.length >= 1200) break;
  }

  // Fill remaining to 1200 with variations
  const extraCats = [...TEMPLATE_CATEGORIES.filter(c => c !== 'all')];
  while (tpl.length < 1200) {
    const pi = tpl.length % palettes.length;
    const fi = (tpl.length * 3) % fontPairs.length;
    const bi = (tpl.length * 7) % btnStyles.length;
    const palette = palettes[pi];
    const font = fontPairs[fi];
    const btn = btnStyles[bi];
    const catIdx = tpl.length % extraCats.length;
    const name = templateNames[tpl.length % templateNames.length] + ' ' + (Math.floor(tpl.length / templateNames.length) + 2);

    tpl.push({
      id: id++,
      name: name,
      category: extraCats[catIdx],
      palette: { ...palette, cat: extraCats[catIdx] },
      font: font,
      btn: btn,
      avatarStyle: avatarStyles[tpl.length % avatarStyles.length],
      bgEffect: bgEffects[tpl.length % bgEffects.length],
      glass: false,
      neon: false,
      previewGradient: generatePreviewGradient(palette),
    });
  }

  return tpl;
}

function generatePreviewGradient(p) {
  const acc = p.accent || '#7c5cfc';
  if (p.bg.startsWith('linear-gradient')) return p.bg;
  return `linear-gradient(160deg, ${p.bg} 0%, ${acc}33 100%)`;
}

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  allTemplates = generateTemplates();
  await initApp();
});

async function initApp() {
  // Check session
  const session = localStorage.getItem('alnyftree_session');
  if (session) {
    try {
      const s = JSON.parse(session);
      // Verify user still exists in DB
      const { data } = await db.from('links_oratree')
        .select('*')
        .eq('type', 'user')
        .eq('username', s.username)
        .single();
      if (data) {
        currentUser = s;
        showPage('dashboard');
        loadDashboard();
      } else {
        localStorage.removeItem('alnyftree_session');
        showPage('landing');
      }
    } catch {
      showPage('landing');
    }
  } else {
    showPage('landing');
  }
  document.getElementById('loading-overlay').classList.add('hidden');
}

// ─── PAGE NAVIGATION ──────────────────────────────────────────
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(`page-${pageId}`);
  if (page) page.classList.add('active');
}

// ─── TOAST ────────────────────────────────────────────────────
function toast(msg, type = 'info') {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${msg}</span>`;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => {
    el.style.animation = 'toastOut 0.4s ease forwards';
    setTimeout(() => el.remove(), 400);
  }, 3500);
}

// ─── AUTH ─────────────────────────────────────────────────────
function showAuthModal(tab = 'login') {
  document.getElementById('auth-modal').classList.remove('hidden');
  switchAuthTab(tab);
}
function hideAuthModal() {
  document.getElementById('auth-modal').classList.add('hidden');
}
function switchAuthTab(tab) {
  document.querySelectorAll('.form-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.getElementById('login-form').classList.toggle('hidden', tab !== 'login');
  document.getElementById('register-form').classList.toggle('hidden', tab !== 'register');
}

async function handleLogin() {
  const username = document.getElementById('login-username').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  if (!username || !password) { toast('Isi username dan password', 'error'); return; }

  // Admin
  if (username === 'administrator' && password === 'Rantauprapat123') {
    currentUser = { username: 'administrator', role: 'admin', display: 'Administrator' };
    localStorage.setItem('alnyftree_session', JSON.stringify(currentUser));
    hideAuthModal();
    toast('Selamat datang, Admin! 👑', 'success');
    showPage('dashboard');
    loadDashboard();
    return;
  }

  const { data, error } = await db.from('links_oratree')
    .select('*')
    .eq('type', 'user')
    .eq('username', username)
    .eq('password', btoa(password))
    .single();

  if (error || !data) { toast('Username atau password salah', 'error'); return; }
  currentUser = { username: data.username, role: 'user', display: data.display_name || data.username };
  localStorage.setItem('alnyftree_session', JSON.stringify(currentUser));
  hideAuthModal();
  toast(`Selamat datang, ${currentUser.display}! 🎉`, 'success');
  showPage('dashboard');
  loadDashboard();
}

async function handleRegister() {
  const username = document.getElementById('reg-username').value.trim().toLowerCase();
  const display = document.getElementById('reg-display').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm').value;
  if (!username || !display || !password || !confirm) { toast('Semua field wajib diisi', 'error'); return; }
  if (password !== confirm) { toast('Password tidak cocok', 'error'); return; }
  if (password.length < 6) { toast('Password minimal 6 karakter', 'error'); return; }
  if (!/^[a-z0-9_-]+$/.test(username)) { toast('Username hanya boleh huruf kecil, angka, - dan _', 'error'); return; }
  if (username === 'administrator') { toast('Username tidak tersedia', 'error'); return; }

  // Check existing
  const { data: existing } = await db.from('links_oratree')
    .select('id').eq('type', 'user').eq('username', username).single();
  if (existing) { toast('Username sudah digunakan', 'error'); return; }

  const { error } = await db.from('links_oratree').insert({
    type: 'user',
    username,
    password: btoa(password),
    display_name: display,
    bio: '',
    avatar: '',
    template_id: 1,
    theme_config: JSON.stringify({ accent: '#7c5cfc', font: "'Syne', sans-serif", btnStyle: 'pill' }),
    links: JSON.stringify([]),
    music: JSON.stringify(null),
    show_music: false,
    created_at: new Date().toISOString(),
  });

  if (error) { toast('Gagal mendaftar: ' + error.message, 'error'); return; }
  currentUser = { username, role: 'user', display };
  localStorage.setItem('alnyftree_session', JSON.stringify(currentUser));
  hideAuthModal();
  toast('Akun berhasil dibuat! 🎉', 'success');
  showPage('dashboard');
  loadDashboard();
}

function logout() {
  currentUser = null;
  currentProfile = null;
  localStorage.removeItem('alnyftree_session');
  showPage('landing');
  toast('Berhasil logout', 'info');
}

// ─── DASHBOARD ────────────────────────────────────────────────
async function loadDashboard() {
  updateNavUser();
  if (currentUser.role === 'admin') {
    showAdminSidebar();
    loadAdminDashboard();
  } else {
    showUserSidebar();
    await loadUserProfile();
    showDashSection('overview');
  }
}

function updateNavUser() {
  const nav = document.getElementById('nav-user-area');
  nav.innerHTML = `
    <div class="nav-user">
      <div class="nav-avatar">${currentUser.display.charAt(0).toUpperCase()}</div>
      <span>${currentUser.display}</span>
      <button class="nav-btn" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Logout</button>
    </div>
  `;
}

function showUserSidebar() {
  document.getElementById('sidebar-content').innerHTML = `
    <div class="sidebar-section">
      <div class="sidebar-label">Menu</div>
      <button class="sidebar-item active" onclick="showDashSection('overview')" data-sec="overview">
        <span class="icon"><i class="fas fa-home"></i></span> Overview
      </button>
      <button class="sidebar-item" onclick="showDashSection('links')" data-sec="links">
        <span class="icon"><i class="fas fa-link"></i></span> Links Saya
      </button>
      <button class="sidebar-item" onclick="showDashSection('templates')" data-sec="templates">
        <span class="icon"><i class="fas fa-paint-roller"></i></span> Template
      </button>
      <button class="sidebar-item" onclick="showDashSection('design')" data-sec="design">
        <span class="icon"><i class="fas fa-pen-fancy"></i></span> Desain
      </button>
      <button class="sidebar-item" onclick="showDashSection('music')" data-sec="music">
        <span class="icon"><i class="fas fa-music"></i></span> Musik
      </button>
      <button class="sidebar-item" onclick="showDashSection('profile')" data-sec="profile">
        <span class="icon"><i class="fas fa-user"></i></span> Profil
      </button>
    </div>
    <div class="sidebar-section">
      <div class="sidebar-label">Support</div>
      <button class="sidebar-item" onclick="showDashSection('complaint')" data-sec="complaint">
        <span class="icon"><i class="fas fa-comment"></i></span> Keluhan / Saran
      </button>
      <button class="sidebar-item" onclick="openPreview()">
        <span class="icon"><i class="fas fa-eye"></i></span> Preview
      </button>
    </div>
  `;
}

function showAdminSidebar() {
  document.getElementById('sidebar-content').innerHTML = `
    <div class="sidebar-section">
      <div class="sidebar-label">Admin Panel</div>
      <button class="sidebar-item active" onclick="showDashSection('admin-overview')" data-sec="admin-overview">
        <span class="icon"><i class="fas fa-chart-bar"></i></span> Dashboard
      </button>
      <button class="sidebar-item" onclick="showDashSection('admin-users')" data-sec="admin-users">
        <span class="icon"><i class="fas fa-users"></i></span> Pengguna
      </button>
      <button class="sidebar-item" onclick="showDashSection('admin-tickets')" data-sec="admin-tickets">
        <span class="icon"><i class="fas fa-ticket-alt"></i></span> Keluhan
        <span class="sidebar-badge" id="ticket-badge">0</span>
      </button>
      <button class="sidebar-item" onclick="showDashSection('admin-songs')" data-sec="admin-songs">
        <span class="icon"><i class="fas fa-headphones"></i></span> Kelola Lagu
      </button>
      <button class="sidebar-item" onclick="showDashSection('admin-links')" data-sec="admin-links">
        <span class="icon"><i class="fas fa-link"></i></span> Semua Link
      </button>
    </div>
  `;
}

function showDashSection(id) {
  document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById(`dash-${id}`);
  if (sec) sec.classList.add('active');
  document.querySelectorAll('.sidebar-item').forEach(b => {
    b.classList.toggle('active', b.dataset.sec === id);
  });
  // Load section data
  if (id === 'overview') loadOverview();
  else if (id === 'links') loadLinks();
  else if (id === 'templates') renderTemplateGallery();
  else if (id === 'design') renderDesignPanel();
  else if (id === 'music') loadMusicSection();
  else if (id === 'profile') loadProfileSection();
  else if (id === 'complaint') loadComplaintSection();
  else if (id === 'admin-overview') loadAdminDashboard();
  else if (id === 'admin-users') loadAdminUsers();
  else if (id === 'admin-tickets') loadAdminTickets();
  else if (id === 'admin-songs') loadAdminSongs();
  else if (id === 'admin-links') loadAdminLinks();
}

// ─── LOAD USER PROFILE ────────────────────────────────────────
async function loadUserProfile() {
  const { data } = await db.from('links_oratree')
    .select('*')
    .eq('type', 'user')
    .eq('username', currentUser.username)
    .single();
  if (data) {
    currentProfile = {
      ...data,
      links: safeJSON(data.links, []),
      theme_config: safeJSON(data.theme_config, {}),
      music: safeJSON(data.music, null),
    };
  }
}

function safeJSON(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

// ─── OVERVIEW ─────────────────────────────────────────────────
function loadOverview() {
  if (!currentProfile) return;
  const links = currentProfile.links || [];
  const tpl = allTemplates.find(t => t.id === currentProfile.template_id) || allTemplates[0];
  document.getElementById('dash-overview').innerHTML = `
    <div class="section-header">
      <div class="section-title">Halo, ${currentProfile.display_name || currentUser.username}! 👋</div>
      <div class="section-sub">Kelola dan kustomisasi linktree-mu</div>
    </div>
    <div class="publish-bar">
      <span style="font-size:14px;font-weight:600;color:var(--text2);"><i class="fas fa-link"></i> Link Publikmu:</span>
      <div class="publish-url">https://alnyftree.vercel.app/${currentUser.username}</div>
      <button class="btn btn-primary btn-sm" onclick="copyLink()"><i class="fas fa-copy"></i> Salin</button>
      <button class="btn btn-secondary btn-sm" onclick="openPreview()"><i class="fas fa-eye"></i> Preview</button>
      <a class="btn btn-secondary btn-sm" href="/${currentUser.username}" target="_blank"><i class="fas fa-external-link-alt"></i> Buka</a>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-icon"><i class="fas fa-link"></i></div>
        <div class="stat-card-num">${links.length}</div>
        <div class="stat-card-label">Total Link</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon"><i class="fas fa-paint-roller"></i></div>
        <div class="stat-card-num">${tpl ? tpl.name : '-'}</div>
        <div class="stat-card-label">Template Aktif</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon"><i class="fas fa-music"></i></div>
        <div class="stat-card-num">${currentProfile.music ? '<i class="fas fa-check-circle" style="color:var(--green);"></i>' : '<i class="fas fa-times-circle" style="color:var(--red);"></i>'}</div>
        <div class="stat-card-label">Musik</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon"><i class="fas fa-user"></i></div>
        <div class="stat-card-num">${currentProfile.display_name || '-'}</div>
        <div class="stat-card-label">Display Name</div>
      </div>
    </div>
    <div style="display:flex;gap:32px;align-items:flex-start;flex-wrap:wrap;">
      <div style="flex:1;min-width:300px;">
        <h3 style="font-family:var(--font-main);margin-bottom:16px;"><i class="fas fa-link"></i> Link Terbaru</h3>
        ${links.slice(0,3).map(l => `
          <div class="link-item" style="margin-bottom:12px;">
            <div class="link-icon-box">${l.icon ? (l.icon.includes('fa-') ? `<i class="${l.icon}"></i>` : l.icon) : '<i class="fas fa-link"></i>'}</div>
            <div class="link-info">
              <div class="link-title">${l.title}</div>
              <div class="link-url">${l.url}</div>
            </div>
          </div>
        `).join('') || '<div style="color:var(--text2);font-size:14px;">Belum ada link. <button class="btn btn-primary btn-sm" onclick="showDashSection(\'links\')"><i class="fas fa-plus"></i> Tambah Sekarang</button></div>'}
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px;">
        <h3 style="font-family:var(--font-main);">Preview</h3>
        <div class="preview-phone">
          <div class="preview-phone-notch"></div>
          <iframe class="preview-iframe" id="overview-preview-frame" src="/${currentUser.username}?preview=1"></iframe>
        </div>
      </div>
    </div>
  `;
}

function copyLink() {
  navigator.clipboard.writeText(`https://alnyftree.vercel.app/${currentUser.username}`);
  toast('Link disalin! 🎉', 'success');
}
function openPreview() {
  window.open(`/${currentUser.username}`, '_blank');
}

// ─── LINKS SECTION ────────────────────────────────────────────
function loadLinks() {
  if (!currentProfile) return;
  const links = currentProfile.links || [];
  document.getElementById('dash-links').innerHTML = `
    <div class="section-header flex justify-between items-center">
      <div>
        <div class="section-title"><i class="fas fa-link"></i> Links Saya</div>
        <div class="section-sub">${links.length} link aktif</div>
      </div>
      <button class="btn btn-primary" onclick="showAddLinkModal()"><i class="fas fa-plus"></i> Tambah Link</button>
    </div>
    <div class="link-list" id="link-list-container">
      ${links.length === 0 ? '<div style="text-align:center;padding:60px;color:var(--text2);">Belum ada link. Klik tombol di atas untuk menambah! 🔗</div>' : links.map((l, i) => renderLinkItem(l, i)).join('')}
    </div>
  `;
  initDragDrop();
}

function renderLinkItem(l, i) {
  return `
    <div class="link-item" draggable="true" data-idx="${i}" data-id="${l.id}">
      <span class="link-drag"><i class="fas fa-grip-vertical"></i></span>
      <div class="link-icon-box">${l.icon ? (l.icon.includes('fa-') ? `<i class="${l.icon}"></i>` : l.icon) : '<i class="fas fa-link"></i>'}</div>
      <div class="link-info">
        <div class="link-title">${l.title}</div>
        <div class="link-url">${l.url}</div>
      </div>
      <label class="toggle toggle-wrap" style="margin-right:8px;">
        <input type="checkbox" ${l.active !== false ? 'checked' : ''} onchange="toggleLink('${l.id}', this.checked)">
        <span class="toggle-slider"></span>
      </label>
      <div class="link-actions">
        <button class="btn btn-ghost btn-xs" onclick="showEditLinkModal('${l.id}')"><i class="fas fa-edit"></i></button>
        <button class="btn btn-danger btn-xs" onclick="deleteLink('${l.id}')"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `;
}

function initDragDrop() {
  const container = document.getElementById('link-list-container');
  if (!container) return;
  container.querySelectorAll('.link-item[draggable]').forEach(item => {
    item.addEventListener('dragstart', e => { dragSrcEl = item; item.classList.add('dragging'); });
    item.addEventListener('dragend', () => { item.classList.remove('dragging'); container.querySelectorAll('.link-item').forEach(i => i.classList.remove('drag-over')); });
    item.addEventListener('dragover', e => { e.preventDefault(); item.classList.add('drag-over'); });
    item.addEventListener('dragleave', () => item.classList.remove('drag-over'));
    item.addEventListener('drop', async e => {
      e.preventDefault();
      item.classList.remove('drag-over');
      if (dragSrcEl && dragSrcEl !== item) {
        const links = [...(currentProfile.links || [])];
        const fromIdx = parseInt(dragSrcEl.dataset.idx);
        const toIdx = parseInt(item.dataset.idx);
        const [moved] = links.splice(fromIdx, 1);
        links.splice(toIdx, 0, moved);
        currentProfile.links = links;
        await saveLinks();
        loadLinks();
      }
    });
  });
}

function showAddLinkModal() {
  editingLinkId = null;
  selectedIcon = 'fas fa-link';
  document.getElementById('link-modal-title').textContent = 'Tambah Link Baru';
  document.getElementById('link-title-input').value = '';
  document.getElementById('link-url-input').value = '';
  document.getElementById('link-icon-display').innerHTML = '<i class="fas fa-link"></i>';
  document.getElementById('link-modal').classList.remove('hidden');
  renderIconPicker();
  renderEmojiPicker();
  renderSocialPresets();
}

function showEditLinkModal(id) {
  const link = (currentProfile.links || []).find(l => l.id === id);
  if (!link) return;
  editingLinkId = id;
  selectedIcon = link.icon || 'fas fa-link';
  document.getElementById('link-modal-title').textContent = 'Edit Link';
  document.getElementById('link-title-input').value = link.title;
  document.getElementById('link-url-input').value = link.url;
  document.getElementById('link-icon-display').innerHTML = link.icon ? (link.icon.includes('fa-') ? `<i class="${link.icon}"></i>` : link.icon) : '<i class="fas fa-link"></i>';
  document.getElementById('link-modal').classList.remove('hidden');
  renderIconPicker();
  renderEmojiPicker();
  renderSocialPresets();
}

function renderIconPicker() {
  document.getElementById('icon-grid').innerHTML = FONT_AWESOME_ICONS.map(ic => `
    <div class="icon-option ${ic === selectedIcon ? 'selected' : ''}" onclick="selectIcon('${ic}')"><i class="${ic}"></i></div>
  `).join('');
}

function renderEmojiPicker() {
  document.getElementById('emoji-grid').innerHTML = EMOJI_ICONS.map(emoji => `
    <div class="emoji-option ${emoji === selectedIcon ? 'selected' : ''}" onclick="selectIcon('${emoji}')">${emoji}</div>
  `).join('');
}

function selectIcon(ic) {
  selectedIcon = ic;
  document.getElementById('link-icon-display').innerHTML = ic.includes('fa-') ? `<i class="${ic}"></i>` : ic;
  renderIconPicker();
  renderEmojiPicker();
}

function renderSocialPresets() {
  document.getElementById('social-preset-grid').innerHTML = SOCIAL_PRESETS.map(s => `
    <div class="social-preset" onclick="applySocialPreset('${s.prefix}','${s.label}','${s.icon}')">
      <span class="s-icon"><i class="${s.icon}"></i></span>${s.label}
    </div>
  `).join('');
}

function applySocialPreset(prefix, label, icon) {
  document.getElementById('link-title-input').value = label;
  document.getElementById('link-url-input').value = prefix;
  selectedIcon = icon;
  document.getElementById('link-icon-display').innerHTML = `<i class="${icon}"></i>`;
  renderIconPicker();
  renderEmojiPicker();
}

async function saveLinkModal() {
  const title = document.getElementById('link-title-input').value.trim();
  const url = document.getElementById('link-url-input').value.trim();
  if (!title || !url) { toast('Judul dan URL wajib diisi', 'error'); return; }

  const links = [...(currentProfile.links || [])];
  if (editingLinkId) {
    const idx = links.findIndex(l => l.id === editingLinkId);
    if (idx !== -1) links[idx] = { ...links[idx], title, url, icon: selectedIcon };
  } else {
    links.push({ id: Date.now().toString(), title, url, icon: selectedIcon, active: true });
  }
  currentProfile.links = links;
  await saveLinks();
  document.getElementById('link-modal').classList.add('hidden');
  loadLinks();
  toast(editingLinkId ? 'Link diperbarui!' : 'Link ditambahkan!', 'success');
}

async function deleteLink(id) {
  if (!confirm('Hapus link ini?')) return;
  currentProfile.links = (currentProfile.links || []).filter(l => l.id !== id);
  await saveLinks();
  loadLinks();
  toast('Link dihapus', 'info');
}

async function toggleLink(id, active) {
  const links = currentProfile.links || [];
  const link = links.find(l => l.id === id);
  if (link) link.active = active;
  await saveLinks();
}

async function saveLinks() {
  await db.from('links_oratree')
    .update({ links: JSON.stringify(currentProfile.links) })
    .eq('type', 'user').eq('username', currentUser.username);
}

// ─── TEMPLATE GALLERY ────────────────────────────────────────
function renderTemplateGallery() {
  const container = document.getElementById('dash-templates');
  let filtered = allTemplates;
  if (currentTemplateFilter !== 'all') filtered = allTemplates.filter(t => t.category === currentTemplateFilter);
  if (templateSearch) filtered = filtered.filter(t => t.name.toLowerCase().includes(templateSearch.toLowerCase()) || t.category.includes(templateSearch.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / TEMPLATES_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * TEMPLATES_PER_PAGE, currentPage * TEMPLATES_PER_PAGE);
  const selectedId = currentProfile?.template_id || 1;

  container.innerHTML = `
    <div class="section-header">
      <div class="section-title"><i class="fas fa-paint-roller"></i> Pilih Template</div>
      <div class="section-sub">${filtered.length} template tersedia dari ${allTemplates.length}+ koleksi</div>
    </div>
    <div class="template-filters">
      ${TEMPLATE_CATEGORIES.map(cat => `
        <button class="filter-btn ${currentTemplateFilter === cat ? 'active' : ''}" onclick="filterTemplates('${cat}')">
          ${cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
      `).join('')}
      <input type="text" class="template-search" placeholder="🔍 Cari template..." value="${templateSearch}" oninput="searchTemplates(this.value)">
    </div>
    <div class="template-grid">
      ${paginated.map(t => renderTemplateCard(t, selectedId === t.id)).join('')}
    </div>
    <div class="pagination">
      <button class="page-btn" onclick="changeTplPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>
      ${Array.from({length: Math.min(7, totalPages)}, (_, i) => {
        let p = currentPage <= 4 ? i + 1 : currentPage - 3 + i;
        if (p > totalPages) return '';
        return `<button class="page-btn ${p === currentPage ? 'active' : ''}" onclick="changeTplPage(${p})">${p}</button>`;
      }).join('')}
      <button class="page-btn" onclick="changeTplPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>
    </div>
  `;
}

function renderTemplateCard(t, selected) {
  const pal = t.palette;
  const bgStyle = pal.bg.startsWith('linear') ? pal.bg : `#${pal.bg.replace('#','')}`;
  const acc = pal.accent;
  return `
    <div class="template-card ${selected ? 'selected' : ''}" onclick="selectTemplate(${t.id})">
      <div class="template-preview" style="background:${bgStyle};">
        <div style="display:flex;flex-direction:column;align-items:center;padding:16px 10px;height:100%;font-family:${t.font.heading};">
          <div style="width:36px;height:36px;border-radius:50%;background:${acc};margin-bottom:6px;flex-shrink:0;"></div>
          <div style="font-size:10px;font-weight:700;color:${pal.text};margin-bottom:2px;text-align:center;white-space:nowrap;overflow:hidden;width:100%;text-overflow:ellipsis;">${t.name}</div>
          <div style="font-size:8px;color:${pal.text}88;margin-bottom:8px;">@username</div>
          ${[1,2,3].map(() => `
            <div style="width:100%;height:22px;border-radius:${t.btn.radius};background:${t.glass ? 'rgba(255,255,255,0.15)' : acc};margin-bottom:5px;border:${t.btn.outline ? `1.5px solid ${acc}` : 'none'};flex-shrink:0;${t.neon ? `box-shadow:0 0 8px ${acc}` : ''}"></div>
          `).join('')}
        </div>
      </div>
      <div class="template-overlay"><div class="template-name">${t.name}</div></div>
      <div class="template-selected-badge"><i class="fas fa-check"></i></div>
    </div>
  `;
}

function filterTemplates(cat) {
  currentTemplateFilter = cat;
  currentPage = 1;
  renderTemplateGallery();
}
function searchTemplates(val) {
  templateSearch = val;
  currentPage = 1;
  renderTemplateGallery();
}
function changeTplPage(p) {
  const filtered = currentTemplateFilter === 'all' ? allTemplates : allTemplates.filter(t => t.category === currentTemplateFilter);
  const total = Math.ceil(filtered.length / TEMPLATES_PER_PAGE);
  if (p < 1 || p > total) return;
  currentPage = p;
  renderTemplateGallery();
  document.getElementById('dash-templates').scrollIntoView({ behavior: 'smooth' });
}

async function selectTemplate(id) {
  currentProfile.template_id = id;
  await db.from('links_oratree')
    .update({ template_id: id })
    .eq('type', 'user').eq('username', currentUser.username);
  toast('Template diterapkan! ✨', 'success');
  renderTemplateGallery();
}

// ─── DESIGN PANEL ─────────────────────────────────────────────
function renderDesignPanel() {
  const cfg = currentProfile?.theme_config || {};
  const currentAccent = cfg.accent || '#7c5cfc';
  const currentFont = cfg.font || "'Syne', sans-serif";
  const currentBtnStyle = cfg.btnStyle || 'pill';
  const currentBg = cfg.bg || '';

  document.getElementById('dash-design').innerHTML = `
    <div class="section-header">
      <div class="section-title"><i class="fas fa-pen-fancy"></i> Desain Linktree</div>
      <div class="section-sub">Kustomisasi tampilan sesuai keinginanmu</div>
    </div>
    <div style="display:flex;gap:32px;flex-wrap:wrap;">
      <div style="flex:1;min-width:300px;">
        <div class="tabs-row">
          <div class="tab-item active" onclick="switchDesignTab('colors',this)"><i class="fas fa-palette"></i> Warna</div>
          <div class="tab-item" onclick="switchDesignTab('fonts',this)"><i class="fas fa-font"></i> Font</div>
          <div class="tab-item" onclick="switchDesignTab('buttons',this)"><i class="fas fa-square"></i> Tombol</div>
          <div class="tab-item" onclick="switchDesignTab('avatar',this)"><i class="fas fa-user-circle"></i> Avatar</div>
        </div>
        <div class="tab-panels">
          <div class="tab-panel active" id="design-tab-colors">
            <div class="form-group">
              <label class="form-label"><i class="fas fa-palette"></i> Warna Aksen</label>
              <div class="color-swatches">
                ${ACCENT_COLORS.map(c => `
                  <div class="color-swatch ${currentAccent === c ? 'selected' : ''}" style="background:${c};" onclick="setAccentColor('${c}')"></div>
                `).join('')}
              </div>
              <div class="flex items-center gap-8" style="margin-top:12px;">
                <label class="form-label" style="margin-bottom:0;">Custom:</label>
                <input type="color" value="${currentAccent}" oninput="setAccentColor(this.value)" style="width:48px;height:36px;border:none;background:none;cursor:pointer;border-radius:8px;">
              </div>
            </div>
            <div class="form-group">
                            <label class="form-label"><i class="fas fa-image"></i> Warna Background Custom</label>
              <div class="flex items-center gap-8">
                <input type="color" value="${currentBg || '#0a0a0f'}" oninput="setCustomBg(this.value)" style="width:48px;height:36px;border:none;background:none;cursor:pointer;border-radius:8px;">
                <input class="form-input" placeholder="#hex atau CSS gradient" value="${currentBg}" oninput="setCustomBg(this.value)" style="flex:1;">
                <button class="btn btn-ghost btn-sm" onclick="setCustomBg('')"><i class="fas fa-undo"></i> Reset</button>
              </div>
            </div>
          </div>
          <div class="tab-panel" id="design-tab-fonts">
            <div class="font-options">
              ${FONT_OPTIONS.map(f => `
                <div class="font-option ${currentFont === f.family ? 'selected' : ''}" onclick="setFont('${f.family.replace(/'/g,'&#39;')}')">
                  <span style="font-family:${f.family};font-size:20px;">${f.display}</span>
                  <div class="font-option-name">${f.name}</div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="tab-panel" id="design-tab-buttons">
            <div class="btn-style-grid">
              ${BTN_STYLE_OPTIONS.map(b => `
                <div class="btn-style-option ${currentBtnStyle === b.id ? 'selected' : ''}" onclick="setBtnStyle('${b.id}')">
                  <div class="btn-preview" style="border-radius:${b.radius};${b.outline ? 'background:transparent;border:2px solid var(--accent);color:var(--accent);' : ''}${b.brutalist ? 'border:3px solid #000;transform:translate(-2px,-2px);box-shadow:3px 3px 0 #000;' : ''}${b.glass ? 'background:rgba(255,255,255,0.15);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.3);' : ''}">Aa</div>
                  <div class="btn-style-label">${b.label}</div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="tab-panel" id="design-tab-avatar">
            <div class="form-group">
              <label class="form-label"><i class="fas fa-camera"></i> URL Avatar / Foto Profil</label>
              <div class="flex gap-8" style="margin-bottom:8px;">
                <input class="form-input" id="avatar-url-input" placeholder="https://..." value="${currentProfile?.avatar || ''}" style="flex:1;">
                <button class="btn btn-primary" onclick="showUploadAvatarModal()"><i class="fas fa-upload"></i> Upload</button>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="saveAvatar()"><i class="fas fa-save"></i> Simpan Avatar</button>
            </div>
            <div class="form-group">
              <label class="form-label"><i class="fas fa-pencil-alt"></i> Bio / Deskripsi</label>
              <textarea class="form-textarea" id="bio-input" placeholder="Tulis bio singkatmu...">${currentProfile?.bio || ''}</textarea>
              <button class="btn btn-secondary btn-sm" style="margin-top:8px;" onclick="saveBio()"><i class="fas fa-save"></i> Simpan Bio</button>
            </div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px;">
        <h3 style="font-family:var(--font-main);">Live Preview</h3>
        <div class="preview-phone">
          <div class="preview-phone-notch"></div>
          <iframe class="preview-iframe" id="design-preview-frame" src="/${currentUser.username}?preview=1"></iframe>
        </div>
        <button class="btn btn-primary btn-sm" onclick="document.getElementById('design-preview-frame').src='/${currentUser.username}?preview=1&t='+Date.now()"><i class="fas fa-sync-alt"></i> Refresh</button>
      </div>
    </div>
  `;
}

function switchDesignTab(tab, el) {
  document.querySelectorAll('#dash-design .tab-item').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#dash-design .tab-panel').forEach(p => p.classList.remove('active'));
  if (el) el.classList.add('active');
  const panel = document.getElementById(`design-tab-${tab}`);
  if (panel) panel.classList.add('active');
}

async function setAccentColor(c) {
  updateThemeConfig({ accent: c });
  document.querySelectorAll('.color-swatch').forEach(s => s.classList.toggle('selected', s.style.background === c));
  await saveThemeConfig();
}
async function setCustomBg(v) {
  updateThemeConfig({ bg: v });
  await saveThemeConfig();
}
async function setFont(f) {
  updateThemeConfig({ font: f });
  document.querySelectorAll('.font-option').forEach(o => o.classList.toggle('selected', o.onclick?.toString().includes(f)));
  await saveThemeConfig();
}
async function setBtnStyle(s) {
  updateThemeConfig({ btnStyle: s });
  document.querySelectorAll('.btn-style-option').forEach(o => o.classList.toggle('selected', o.onclick?.toString().includes(s)));
  await saveThemeConfig();
  toast('Style tombol diterapkan!', 'success');
}
function updateThemeConfig(updates) {
  if (!currentProfile) return;
  currentProfile.theme_config = { ...currentProfile.theme_config, ...updates };
}
async function saveThemeConfig() {
  await db.from('links_oratree')
    .update({ theme_config: JSON.stringify(currentProfile.theme_config) })
    .eq('type', 'user').eq('username', currentUser.username);
}
async function saveAvatar() {
  const url = document.getElementById('avatar-url-input').value.trim();
  currentProfile.avatar = url;
  await db.from('links_oratree').update({ avatar: url }).eq('type', 'user').eq('username', currentUser.username);
  toast('Avatar disimpan!', 'success');
}
async function saveBio() {
  const bio = document.getElementById('bio-input').value.trim();
  currentProfile.bio = bio;
  await db.from('links_oratree').update({ bio }).eq('type', 'user').eq('username', currentUser.username);
  toast('Bio disimpan!', 'success');
}

// ─── UPLOAD FUNCTIONS ─────────────────────────────────────────
async function uploadAvatar() {
  const fileInput = document.getElementById('avatar-file-input');
  if (!fileInput.files || fileInput.files.length === 0) {
    toast('Pilih file foto terlebih dahulu', 'error');
    return;
  }

  const file = fileInput.files[0];
  if (!file.type.startsWith('image/')) {
    toast('File harus berupa gambar', 'error');
    return;
  }

  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    toast('Ukuran file maksimal 5MB', 'error');
    return;
  }

  // Convert to base64 for demo (in production, upload to Supabase Storage)
  const reader = new FileReader();
  reader.onload = async function(e) {
    const base64 = e.target.result;
    currentProfile.avatar = base64;
    await db.from('links_oratree').update({ avatar: base64 }).eq('type', 'user').eq('username', currentUser.username);
    document.getElementById('upload-avatar-modal').classList.add('hidden');
    toast('Avatar berhasil diupload!', 'success');
    loadProfileSection();
  };
  reader.readAsDataURL(file);
}

async function uploadMusic() {
  const title = document.getElementById('upload-song-title').value.trim();
  const artist = document.getElementById('upload-song-artist').value.trim();
  const musicFile = document.getElementById('music-file-input').files[0];
  const coverFile = document.getElementById('music-cover-input').files[0];

  if (!title || !artist) {
    toast('Judul dan artis wajib diisi', 'error');
    return;
  }

  if (!musicFile) {
    toast('Pilih file audio terlebih dahulu', 'error');
    return;
  }

  if (!musicFile.type.startsWith('audio/')) {
    toast('File harus berupa audio', 'error');
    return;
  }

  if (musicFile.size > 10 * 1024 * 1024) { // 10MB limit
    toast('Ukuran file audio maksimal 10MB', 'error');
    return;
  }

  // Convert to base64 for demo
  const musicReader = new FileReader();
  
  musicReader.onload = async function(e) {
    const musicBase64 = e.target.result;
    
    // Handle cover if exists
    if (coverFile) {
      const coverReader = new FileReader();
      coverReader.onload = async function(ev) {
        const coverBase64 = ev.target.result;
        
        const songData = {
          id: Date.now().toString(),
          title: title,
          artist: artist,
          url: musicBase64,
          cover: coverBase64
        };
        
        currentProfile.music = songData;
        currentProfile.show_music = true;
        
        await db.from('links_oratree').update({ 
          music: JSON.stringify(songData),
          show_music: true 
        }).eq('type', 'user').eq('username', currentUser.username);
        
        document.getElementById('upload-music-modal').classList.add('hidden');
        toast('Lagu berhasil diupload! 🎵', 'success');
        loadMusicSection();
      };
      coverReader.readAsDataURL(coverFile);
    } else {
      const songData = {
        id: Date.now().toString(),
        title: title,
        artist: artist,
        url: musicBase64,
        cover: 'https://via.placeholder.com/80'
      };
      
      currentProfile.music = songData;
      currentProfile.show_music = true;
      
      await db.from('links_oratree').update({ 
        music: JSON.stringify(songData),
        show_music: true 
      }).eq('type', 'user').eq('username', currentUser.username);
      
      document.getElementById('upload-music-modal').classList.add('hidden');
      toast('Lagu berhasil diupload! 🎵', 'success');
      loadMusicSection();
    }
  };
  
  musicReader.readAsDataURL(musicFile);
}

// ─── MUSIC SECTION ────────────────────────────────────────────
async function loadMusicSection() {
  const { data: songs } = await db.from('links_oratree')
    .select('*').eq('type', 'song');
  const currentMusicId = currentProfile?.music?.id;

  document.getElementById('dash-music').innerHTML = `
    <div class="section-header">
      <div class="section-title"><i class="fas fa-music"></i> Musik di Linktree</div>
      <div class="section-sub">Pilih lagu yang akan diputar di halaman linktreemu</div>
    </div>
    <div class="publish-bar" style="margin-bottom:24px;">
      <label class="toggle-wrap">
        <label class="toggle">
          <input type="checkbox" id="show-music-toggle" ${currentProfile?.show_music ? 'checked' : ''} onchange="toggleShowMusic(this.checked)">
          <span class="toggle-slider"></span>
        </label>
        <span style="font-weight:600;"><i class="fas fa-music"></i> Tampilkan tombol musik di linktree</span>
      </label>
      <button class="btn btn-primary" onclick="showUploadMusicModal()" style="margin-left:auto;"><i class="fas fa-upload"></i> Upload Lagu Sendiri</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;">
      <div class="song-card ${!currentMusicId ? 'selected' : ''}" onclick="selectMusic(null)" style="background:var(--surface);border:2px solid ${!currentMusicId ? 'var(--accent)' : 'var(--border)'};border-radius:var(--radius);padding:16px;cursor:pointer;text-align:center;">
        <div style="font-size:40px;margin-bottom:8px;"><i class="fas fa-volume-mute"></i></div>
        <div style="font-weight:600;font-size:14px;">Tidak Ada Musik</div>
      </div>
      ${(songs||[]).map(s => `
        <div class="song-card ${currentMusicId === s.id ? 'selected' : ''}" onclick="selectMusic(${JSON.stringify({id:s.id,title:s.song_title,artist:s.artist,cover:s.cover_url,url:s.audio_url}).replace(/"/g,'&quot;')})"
          style="background:var(--surface);border:2px solid ${currentMusicId === s.id ? 'var(--accent)' : 'var(--border)'};border-radius:var(--radius);padding:16px;cursor:pointer;transition:all 0.3s;">
          <img src="${s.cover_url || 'https://via.placeholder.com/80'}" style="width:80px;height:80px;border-radius:12px;object-fit:cover;margin:0 auto 10px;display:block;">
          <div style="font-weight:700;font-size:14px;margin-bottom:4px;text-align:center;">${s.song_title}</div>
          <div style="font-size:12px;color:var(--text2);text-align:center;">${s.artist}</div>
        </div>
      `).join('') || '<div style="color:var(--text2);grid-column:1/-1;">Admin belum menambahkan lagu.</div>'}
    </div>
  `;
}

async function toggleShowMusic(val) {
  currentProfile.show_music = val;
  await db.from('links_oratree').update({ show_music: val }).eq('type','user').eq('username', currentUser.username);
  toast(val ? 'Musik diaktifkan!' : 'Musik disembunyikan', 'info');
}

async function selectMusic(song) {
  currentProfile.music = song;
  await db.from('links_oratree').update({ music: JSON.stringify(song) }).eq('type','user').eq('username',currentUser.username);
  loadMusicSection();
  toast(song ? `Lagu "${song.title}" dipilih! 🎶` : 'Musik dihapus', 'success');
}

// ─── PROFILE SECTION ─────────────────────────────────────────
function loadProfileSection() {
  document.getElementById('dash-profile').innerHTML = `
    <div class="section-header">
      <div class="section-title"><i class="fas fa-user-circle"></i> Pengaturan Profil</div>
    </div>
    <div style="max-width:560px;">
      <div class="form-group" style="text-align:center;">
        <div class="profile-avatar-wrap">
          <img class="profile-avatar-img" src="${currentProfile?.avatar || 'https://ui-avatars.com/api/?name='+encodeURIComponent(currentProfile?.display_name||'U')+'&background=7c5cfc&color=fff&size=120'}" id="profile-avatar-img">
          <button class="profile-avatar-edit" onclick="showUploadAvatarModal()"><i class="fas fa-camera"></i></button>
        </div>
        <div style="margin-top:16px;">
          <button class="btn btn-secondary btn-sm" onclick="showUploadAvatarModal()"><i class="fas fa-upload"></i> Upload Foto</button>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label"><i class="fas fa-id-card"></i> Display Name</label>
        <input class="form-input" id="profile-display" value="${currentProfile?.display_name||''}">
      </div>
      <div class="form-group">
        <label class="form-label"><i class="fas fa-pencil-alt"></i> Bio</label>
        <textarea class="form-textarea" id="profile-bio">${currentProfile?.bio||''}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label"><i class="fas fa-at"></i> Username (= URL link kamu)</label>
        <input class="form-input" value="${currentUser.username}" readonly style="opacity:0.5;cursor:not-allowed;">
        <small style="color:var(--text2);font-size:12px;">Username tidak bisa diubah</small>
      </div>
      <div style="display:flex;gap:12px;">
        <button class="btn btn-primary" onclick="saveProfile()"><i class="fas fa-save"></i> Simpan Profil</button>
      </div>
      <hr style="margin:32px 0;border-color:var(--border);">
      <h3 style="font-family:var(--font-main);margin-bottom:20px;"><i class="fas fa-lock"></i> Ganti Password</h3>
      <div class="form-group">
        <label class="form-label">Password Baru</label>
        <input class="form-input" type="password" id="new-password" placeholder="Minimal 6 karakter">
      </div>
      <div class="form-group">
        <label class="form-label">Konfirmasi Password</label>
        <input class="form-input" type="password" id="confirm-password">
      </div>
      <button class="btn btn-secondary" onclick="changePassword()"><i class="fas fa-key"></i> Ganti Password</button>
    </div>
  `;
}

async function saveProfile() {
  const display = document.getElementById('profile-display').value.trim();
  const bio = document.getElementById('profile-bio').value.trim();
  if (!display) { toast('Display name wajib diisi', 'error'); return; }
  
  await db.from('links_oratree').update({ display_name: display, bio })
    .eq('type', 'user').eq('username', currentUser.username);
  
  currentProfile.display_name = display;
  currentProfile.bio = bio;
  currentUser.display = display;
  localStorage.setItem('alnyftree_session', JSON.stringify(currentUser));
  updateNavUser();
  toast('Profil disimpan! 🎉', 'success');
}

async function changePassword() {
  const np = document.getElementById('new-password').value;
  const cp = document.getElementById('confirm-password').value;
  if (!np || !cp) { toast('Isi kedua field password', 'error'); return; }
  if (np !== cp) { toast('Password tidak cocok', 'error'); return; }
  if (np.length < 6) { toast('Password minimal 6 karakter', 'error'); return; }
  await db.from('links_oratree').update({ password: btoa(np) })
    .eq('type', 'user').eq('username', currentUser.username);
  toast('Password berhasil diganti!', 'success');
}

// ─── COMPLAINT ────────────────────────────────────────────────
function loadComplaintSection() {
  document.getElementById('dash-complaint').innerHTML = `
    <div class="section-header">
      <div class="section-title"><i class="fas fa-comment"></i> Keluhan & Saran</div>
      <div class="section-sub">Sampaikan kritik, saran, atau minta bantuan kepada admin</div>
    </div>
    <div style="max-width:560px;">
      <div class="form-group">
        <label class="form-label">Jenis Pesan</label>
        <div class="complaint-types">
          <button class="complaint-type-btn selected" onclick="setComplainType('saran',this)"><i class="fas fa-lightbulb"></i> Saran</button>
          <button class="complaint-type-btn" onclick="setComplainType('kritik',this)"><i class="fas fa-exclamation-triangle"></i> Kritik</button>
          <button class="complaint-type-btn" onclick="setComplainType('bantuan',this)"><i class="fas fa-question-circle"></i> Bantuan</button>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Pesan</label>
        <textarea class="form-textarea" id="complaint-msg" placeholder="Tulis pesanmu di sini..." style="min-height:140px;"></textarea>
      </div>
      <button class="btn btn-primary" onclick="submitComplaint()"><i class="fas fa-paper-plane"></i> Kirim Pesan</button>
    </div>
  `;
  complainType = 'saran';
}

function setComplainType(type, el) {
  complainType = type;
  document.querySelectorAll('.complaint-type-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
}

async function submitComplaint() {
  const msg = document.getElementById('complaint-msg').value.trim();
  if (!msg) { toast('Isi pesan terlebih dahulu', 'error'); return; }
  await db.from('links_oratree').insert({
    type: 'ticket',
    username: currentUser.username,
    ticket_type: complainType,
    message: msg,
    status: 'open',
    created_at: new Date().toISOString(),
  });
  document.getElementById('complaint-msg').value = '';
  toast('Pesan berhasil dikirim ke admin! 📨', 'success');
}

// ─── ADMIN DASHBOARD ─────────────────────────────────────────
async function loadAdminDashboard() {
  const { data: users } = await db.from('links_oratree').select('*').eq('type', 'user');
  const { data: tickets } = await db.from('links_oratree').select('*').eq('type', 'ticket').eq('status', 'open');
  const { data: songs } = await db.from('links_oratree').select('*').eq('type', 'song');
  const allLinks = (users || []).reduce((acc, u) => acc + (safeJSON(u.links, []).length), 0);

  // Update badge
  const badge = document.getElementById('ticket-badge');
  if (badge) badge.textContent = (tickets || []).length;

  document.getElementById('dash-admin-overview').innerHTML = `
    <div class="section-header">
      <div class="section-title"><i class="fas fa-crown"></i> Admin Dashboard</div>
      <div class="section-sub">Kontrol penuh semua pengguna dan konten</div>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-card-icon"><i class="fas fa-users"></i></div><div class="stat-card-num">${(users||[]).length}</div><div class="stat-card-label">Total Pengguna</div></div>
      <div class="stat-card"><div class="stat-card-icon"><i class="fas fa-link"></i></div><div class="stat-card-num">${allLinks}</div><div class="stat-card-label">Total Link</div></div>
      <div class="stat-card"><div class="stat-card-icon"><i class="fas fa-ticket-alt"></i></div><div class="stat-card-num">${(tickets||[]).length}</div><div class="stat-card-label">Tiket Terbuka</div></div>
      <div class="stat-card"><div class="stat-card-icon"><i class="fas fa-music"></i></div><div class="stat-card-num">${(songs||[]).length}</div><div class="stat-card-label">Lagu Tersedia</div></div>
      <div class="stat-card"><div class="stat-card-icon"><i class="fas fa-paint-roller"></i></div><div class="stat-card-num">${allTemplates.length}</div><div class="stat-card-label">Total Template</div></div>
    </div>
  `;
}

async function loadAdminUsers() {
  const { data: users } = await db.from('links_oratree').select('*').eq('type', 'user').order('created_at', { ascending: false });
  document.getElementById('dash-admin-users').innerHTML = `
    <div class="section-header flex justify-between items-center">
      <div>
        <div class="section-title"><i class="fas fa-users"></i> Semua Pengguna</div>
        <div class="section-sub">${(users||[]).length} pengguna terdaftar</div>
      </div>
    </div>
    <div style="overflow-x:auto;">
      <table class="admin-users-table">
        <thead>
          <tr>
            <th>Pengguna</th><th>Display Name</th><th>Total Link</th><th>Dibuat</th><th>Status</th><th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${(users||[]).map(u => `
            <tr>
              <td><a href="/${u.username}" target="_blank" style="color:var(--accent);">@${u.username}</a></td>
              <td>${u.display_name||'-'}</td>
              <td>${safeJSON(u.links,[]).length}</td>
              <td>${u.created_at ? new Date(u.created_at).toLocaleDateString('id-ID') : '-'}</td>
              <td><span class="user-status-badge badge-active"><i class="fas fa-check-circle"></i> Aktif</span></td>
              <td style="display:flex;gap:6px;flex-wrap:wrap;">
                <button class="btn btn-ghost btn-xs" onclick="adminEditUser('${u.username}')"><i class="fas fa-edit"></i></button>
                <button class="btn btn-ghost btn-xs" onclick="adminViewLinks('${u.username}')"><i class="fas fa-link"></i></button>
                <button class="btn btn-danger btn-xs" onclick="adminDeleteUser('${u.username}')"><i class="fas fa-trash"></i></button>
              </td>
            </tr>
          `).join('') || '<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--text2);">Belum ada pengguna</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

async function adminDeleteUser(username) {
  if (!confirm(`Hapus akun @${username} beserta semua datanya?`)) return;
  await db.from('links_oratree').delete().eq('type', 'user').eq('username', username);
  toast(`Akun @${username} dihapus`, 'info');
  loadAdminUsers();
}

function adminEditUser(username) {
  adminEditUserId = username;
  document.getElementById('admin-edit-username').value = username;
  document.getElementById('admin-edit-display').value = '';
  document.getElementById('admin-edit-password').value = '';
  document.getElementById('admin-edit-modal').classList.remove('hidden');
  // Load current data
  db.from('links_oratree').select('*').eq('type','user').eq('username',username).single().then(({data}) => {
    if (data) {
      document.getElementById('admin-edit-display').value = data.display_name || '';
    }
  });
}

async function saveAdminEditUser() {
  const newUsername = document.getElementById('admin-edit-username').value.trim().toLowerCase();
  const display = document.getElementById('admin-edit-display').value.trim();
  const password = document.getElementById('admin-edit-password').value;
  const updates = {};
  if (newUsername && newUsername !== adminEditUserId) updates.username = newUsername;
  if (display) updates.display_name = display;
  if (password && password.length >= 6) updates.password = btoa(password);
  if (Object.keys(updates).length === 0) { toast('Tidak ada perubahan', 'info'); return; }
  await db.from('links_oratree').update(updates).eq('type','user').eq('username', adminEditUserId);
  document.getElementById('admin-edit-modal').classList.add('hidden');
  toast('Pengguna diperbarui!', 'success');
  loadAdminUsers();
}

async function adminViewLinks(username) {
  const { data } = await db.from('links_oratree').select('*').eq('type','user').eq('username',username).single();
  if (!data) return;
  const links = safeJSON(data.links, []);
  const html = links.map(l => `
    <div style="padding:12px;background:var(--surface2);border-radius:8px;margin-bottom:8px;display:flex;gap:10px;align-items:center;">
      <span>${l.icon ? (l.icon.includes('fa-') ? `<i class="${l.icon}"></i>` : l.icon) : '<i class="fas fa-link"></i>'}</span>
      <div style="flex:1;">
        <div style="font-weight:600;font-size:14px;">${l.title}</div>
        <div style="font-size:12px;color:var(--text2);word-break:break-all;">${l.url}</div>
      </div>
    </div>
  `).join('') || '<div style="color:var(--text2);text-align:center;padding:20px;">Tidak ada link</div>';
  showInfoModal(`Links @${username}`, html);
}

function showInfoModal(title, content) {
  document.getElementById('info-modal-title').textContent = title;
  document.getElementById('info-modal-body').innerHTML = content;
  document.getElementById('info-modal').classList.remove('hidden');
}

async function loadAdminTickets() {
  const { data: tickets } = await db.from('links_oratree').select('*').eq('type', 'ticket').order('created_at', { ascending: false });
  const badge = document.getElementById('ticket-badge');
  const open = (tickets||[]).filter(t => t.status === 'open').length;
  if (badge) badge.textContent = open;
  document.getElementById('dash-admin-tickets').innerHTML = `
    <div class="section-header">
      <div class="section-title"><i class="fas fa-ticket-alt"></i> Keluhan & Saran</div>
      <div class="section-sub">${open} belum ditangani</div>
    </div>
    ${(tickets||[]).length === 0 ? '<div style="text-align:center;padding:60px;color:var(--text2);">Belum ada keluhan</div>' :
    (tickets||[]).map(t => `
      <div class="ticket-card">
        <div class="ticket-header">
          <div class="ticket-user"><i class="fas fa-user"></i> @${t.username}</div>
          <div class="ticket-time"><i class="fas fa-clock"></i> ${t.created_at ? new Date(t.created_at).toLocaleString('id-ID') : ''}</div>
        </div>
        <span class="ticket-type ticket-${t.ticket_type}">
          ${t.ticket_type === 'saran' ? '<i class="fas fa-lightbulb"></i> Saran' : 
            t.ticket_type === 'kritik' ? '<i class="fas fa-exclamation-triangle"></i> Kritik' : 
            '<i class="fas fa-question-circle"></i> Bantuan'}
        </span>
        <div class="ticket-body">${t.message}</div>
        <div style="margin-top:10px;display:flex;gap:8px;">
          ${t.status === 'open' ? `<button class="btn btn-success btn-xs" onclick="closeTicket('${t.id}')"><i class="fas fa-check"></i> Tandai Selesai</button>` : '<span style="color:var(--green);font-size:12px;"><i class="fas fa-check-circle"></i> Selesai</span>'}
          <button class="btn btn-danger btn-xs" onclick="deleteTicket('${t.id}')"><i class="fas fa-trash"></i> Hapus</button>
        </div>
      </div>
    `).join('')}
  `;
}

async function closeTicket(id) {
  await db.from('links_oratree').update({ status: 'closed' }).eq('id', id);
  loadAdminTickets();
  toast('Tiket ditandai selesai', 'success');
}
async function deleteTicket(id) {
  await db.from('links_oratree').delete().eq('id', id);
  loadAdminTickets();
  toast('Tiket dihapus', 'info');
}

async function loadAdminSongs() {
  const { data: songs } = await db.from('links_oratree').select('*').eq('type', 'song').order('created_at', { ascending: false });
  document.getElementById('dash-admin-songs').innerHTML = `
    <div class="section-header flex justify-between items-center">
      <div>
        <div class="section-title"><i class="fas fa-headphones"></i> Kelola Lagu</div>
        <div class="section-sub">${(songs||[]).length} lagu tersedia</div>
      </div>
      <button class="btn btn-primary" onclick="showAddSongModal()"><i class="fas fa-plus"></i> Tambah Lagu</button>
    </div>
    <div class="song-admin-list">
      ${(songs||[]).map(s => `
        <div class="song-admin-item">
          <img class="song-admin-cover" src="${s.cover_url||'https://via.placeholder.com/48'}" onerror="this.src='https://via.placeholder.com/48'">
          <div class="song-admin-info">
            <div class="song-admin-title">${s.song_title}</div>
            <div class="song-admin-artist">${s.artist}</div>
            <div style="font-size:11px;color:var(--text2);margin-top:2px;">${s.audio_url}</div>
          </div>
          <button class="btn btn-danger btn-xs" onclick="deleteSong('${s.id}')"><i class="fas fa-trash"></i></button>
        </div>
      `).join('') || '<div style="color:var(--text2);text-align:center;padding:40px;">Belum ada lagu. Tambah sekarang!</div>'}
    </div>
  `;
}

function showAddSongModal() {
  document.getElementById('song-modal').classList.remove('hidden');
}

async function saveSong() {
  const title = document.getElementById('song-title').value.trim();
  const artist = document.getElementById('song-artist').value.trim();
  const audio_url = document.getElementById('song-audio').value.trim();
  const cover_url = document.getElementById('song-cover').value.trim();
  if (!title || !artist || !audio_url) { toast('Judul, artis, dan URL audio wajib diisi', 'error'); return; }
  await db.from('links_oratree').insert({
    type: 'song',
    song_title: title,
    artist,
    audio_url,
    cover_url,
    created_at: new Date().toISOString(),
  });
  document.getElementById('song-modal').classList.add('hidden');
  document.getElementById('song-title').value = '';
  document.getElementById('song-artist').value = '';
  document.getElementById('song-audio').value = '';
  document.getElementById('song-cover').value = '';
  toast('Lagu ditambahkan!', 'success');
  loadAdminSongs();
}

async function deleteSong(id) {
  if (!confirm('Hapus lagu ini?')) return;
  await db.from('links_oratree').delete().eq('id', id);
  toast('Lagu dihapus', 'info');
  loadAdminSongs();
}

async function loadAdminLinks() {
  const { data: users } = await db.from('links_oratree').select('*').eq('type', 'user');
  let allRows = [];
  (users || []).forEach(u => {
    const links = safeJSON(u.links, []);
    links.forEach(l => allRows.push({ ...l, username: u.username }));
  });
  document.getElementById('dash-admin-links').innerHTML = `
    <div class="section-header">
      <div class="section-title"><i class="fas fa-link"></i> Semua Link</div>
      <div class="section-sub">${allRows.length} link dari ${(users||[]).length} pengguna</div>
    </div>
    <div style="overflow-x:auto;">
      <table class="admin-users-table">
        <thead><tr><th>Pengguna</th><th>Icon</th><th>Judul</th><th>URL</th><th>Status</th></tr></thead>
        <tbody>
          ${allRows.map(l => `
            <tr>
              <td><a href="/${l.username}" target="_blank" style="color:var(--accent);">@${l.username}</a></td>
              <td>${l.icon ? (l.icon.includes('fa-') ? `<i class="${l.icon}"></i>` : l.icon) : '<i class="fas fa-link"></i>'}</td>
              <td>${l.title}</td>
              <td><a href="${l.url}" target="_blank" style="color:var(--accent3);font-size:12px;">${l.url.substring(0,40)}${l.url.length>40?'...':''}</a></td>
              <td><span class="user-status-badge ${l.active!==false ? 'badge-active' : ''}">${l.active!==false ? '<i class="fas fa-check-circle"></i> Aktif' : '<i class="fas fa-times-circle"></i> Nonaktif'}</span></td>
            </tr>
          `).join('') || '<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--text2);">Belum ada link</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

// ─── EXPOSE FUNCTIONS TO GLOBAL ───────────────────────────────
window.showAuthModal = showAuthModal;
window.hideAuthModal = hideAuthModal;
window.switchAuthTab = switchAuthTab;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.logout = logout;
window.showDashSection = showDashSection;
window.copyLink = copyLink;
window.openPreview = openPreview;
window.showAddLinkModal = showAddLinkModal;
window.showEditLinkModal = showEditLinkModal;
window.saveLinkModal = saveLinkModal;
window.deleteLink = deleteLink;
window.toggleLink = toggleLink;
window.selectIcon = selectIcon;
window.applySocialPreset = applySocialPreset;
window.filterTemplates = filterTemplates;
window.searchTemplates = searchTemplates;
window.changeTplPage = changeTplPage;
window.selectTemplate = selectTemplate;
window.renderDesignPanel = renderDesignPanel;
window.switchDesignTab = switchDesignTab;
window.setAccentColor = setAccentColor;
window.setCustomBg = setCustomBg;
window.setFont = setFont;
window.setBtnStyle = setBtnStyle;
window.saveAvatar = saveAvatar;
window.saveBio = saveBio;
window.toggleShowMusic = toggleShowMusic;
window.selectMusic = selectMusic;
window.loadMusicSection = loadMusicSection;
window.saveProfile = saveProfile;
window.changePassword = changePassword;
window.setComplainType = setComplainType;
window.submitComplaint = submitComplaint;
window.adminDeleteUser = adminDeleteUser;
window.adminEditUser = adminEditUser;
window.saveAdminEditUser = saveAdminEditUser;
window.adminViewLinks = adminViewLinks;
window.showInfoModal = showInfoModal;
window.closeTicket = closeTicket;
window.deleteTicket = deleteTicket;
window.showAddSongModal = showAddSongModal;
window.saveSong = saveSong;
window.deleteSong = deleteSong;
window.showUploadAvatarModal = showUploadAvatarModal;
window.showUploadMusicModal = showUploadMusicModal;
window.uploadAvatar = uploadAvatar;
window.uploadMusic = uploadMusic;
window.allTemplates = allTemplates;
window.safeJSON = safeJSON;
