#!/bin/bash
# =============================================================================
# VIDEO AUDIT SCRIPT
# Compares YouTube video IDs between WordPress (live) and local Next.js pages
# =============================================================================

cd "$(dirname "$0")/.."

echo "=============================================="
echo "  VIDEO AUDIT: WordPress vs Local Next.js"
echo "=============================================="
echo ""

MISMATCHES=0
CHECKED=0

audit_page() {
  local wp_slug="$1"
  local local_file="$2"
  local wp_url="https://www.mosquitocurtains.com/${wp_slug}/"
  
  CHECKED=$((CHECKED + 1))
  
  echo "--- /${wp_slug}/ ---"
  
  # Get WordPress video IDs
  wp_videos=$(curl -s "$wp_url" | grep -o 'youtube[^"]*embed/[a-zA-Z0-9_-]*' | grep -o '[^/]*$' | sort -u)
  
  # Get local video IDs
  if [ -f "$local_file" ]; then
    local_videos=$(grep -oE 'videoId="[a-zA-Z0-9_-]+"' "$local_file" | sed 's/videoId="//;s/"//' | sort -u)
    # Also check for videoId={'...'} patterns
    local_videos2=$(grep -oE "videoId='[a-zA-Z0-9_-]+'" "$local_file" | sed "s/videoId='//;s/'//" | sort -u)
    if [ -n "$local_videos2" ]; then
      local_videos=$(echo -e "$local_videos\n$local_videos2" | sort -u)
    fi
  else
    echo "  [FILE NOT FOUND: $local_file]"
    echo ""
    return
  fi
  
  wp_list=$(echo "$wp_videos" | tr '\n' ' ')
  local_list=$(echo "$local_videos" | tr '\n' ' ')
  
  # Find videos in WP but not in local
  missing=""
  for vid in $wp_videos; do
    if [ -n "$vid" ] && ! echo "$local_videos" | grep -q "$vid"; then
      missing="$missing $vid"
    fi
  done
  
  # Find videos in local but not in WP
  extra=""
  for vid in $local_videos; do
    if [ -n "$vid" ] && ! echo "$wp_videos" | grep -q "$vid"; then
      extra="$extra $vid"
    fi
  done
  
  if [ -n "$missing" ] || [ -n "$extra" ]; then
    MISMATCHES=$((MISMATCHES + 1))
    echo "  MISMATCH!"
    echo "  WP:    $wp_list"
    echo "  Local: $local_list"
    [ -n "$missing" ] && echo "  MISSING from local:$missing"
    [ -n "$extra" ] && echo "  EXTRA in local (wrong?):$extra"
  else
    echo "  OK - videos match: $wp_list"
  fi
  echo ""
}

echo "=== HIGH PRIORITY: Multi-video pages ==="
echo ""
audit_page "garage-door-screens" "src/app/garage-door-screens/page.tsx"
audit_page "french-door-screens" "src/app/french-door-screens/page.tsx"
audit_page "screen-porch-enclosures" "src/app/screened-porch/page.tsx"
audit_page "screen-patio" "src/app/screen-patio/page.tsx"
audit_page "boat-screens" "src/app/boat-screens/page.tsx"
audit_page "clear-vinyl-plastic-patio-enclosures" "src/app/clear-vinyl-plastic-patio-enclosures/page.tsx"
audit_page "weather-curtains" "src/app/weather-curtains/page.tsx"
audit_page "options" "src/app/options/page.tsx"

echo "=== MEDIUM PRIORITY: Hero/single video pages ==="
echo ""
audit_page "roll-up-shade-screens" "src/app/roll-up-shade-screens/page.tsx"
audit_page "yardistry-gazebo-curtains" "src/app/yardistry-gazebo-curtains/page.tsx"
audit_page "tentscreenpanels" "src/app/tent-screens/page.tsx"
audit_page "outdoor-projection-screens" "src/app/outdoor-projection-screens/page.tsx"
audit_page "industrial-netting" "src/app/industrial-netting/page.tsx"
audit_page "camping-net" "src/app/camping-net/page.tsx"
audit_page "awning-screen-enclosures" "src/app/awning-screen-enclosures/page.tsx"
audit_page "screened-in-decks" "src/app/screened-in-decks/page.tsx"
audit_page "gazebo-screen-curtains" "src/app/gazebo-screen-curtains/page.tsx"
audit_page "pergola-screen-curtains" "src/app/pergola-screen-curtains/page.tsx"
audit_page "hvac-chiller-screens" "src/app/hvac-chiller-screens/page.tsx"

echo "=== INSTALL PAGES ==="
echo ""
audit_page "install" "src/app/install/tracking/page.tsx"
audit_page "install-velcro" "src/app/install/velcro/page.tsx"
audit_page "install-clear-vinyl" "src/app/install/clear-vinyl/page.tsx"

echo "=== PLAN PAGES ==="
echo ""
audit_page "project-planning" "src/app/plan/overview/page.tsx"
audit_page "plan-screen-porch/outdoor-curtain-tracking" "src/app/plan/tracking/page.tsx"
audit_page "plan-screen-porch/magnetic-doorways" "src/app/plan/magnetic-doorways/page.tsx"
audit_page "plan-screen-porch/sealing-the-base" "src/app/plan/sealing-base/page.tsx"

echo "=============================================="
echo "  SUMMARY: Checked $CHECKED pages, $MISMATCHES mismatches found"
echo "=============================================="
